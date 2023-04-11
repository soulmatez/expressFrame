<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
export default {
  name: 'role',
};
</script>

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, computed } from 'vue';
import {
  listRolesPage,
  updateRole,
  getRoleFormDetail,
  addRole,
  deleteRoles,
} from '@/api/system/role';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { Search, Plus, Edit, Refresh, Delete } from '@element-plus/icons-vue';
import { RoleFormData, RoleItem, RoleQueryParam } from '@/types';

const emit = defineEmits(['roleClick']);
const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm); // 属性名必须和元素的ref属性值一致
// 设置表格某行禁用
const selectEnable = (row: RoleItem, index: Number) => {
  return row.role == 'ROOT' ? false : true
}
const state = reactive({
  loading: true,
  // 选中ID数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
  } as RoleQueryParam,
  roleList: [] as RoleItem[],
  total: 0,
  dialog: {
    title: '',
    visible: false,
  },
  formData: {
    sort: 0
  } as RoleFormData,
  rules: {
    roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
    role: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
  },
});

const {
  loading,
  multiple,
  queryParams,
  roleList,
  total,
  dialog,
  formData,
  rules,
} = toRefs(state);

function handleQuery() {
  emit('roleClick', {});
  state.loading = true;
  listRolesPage(state.queryParams).then(({ data }) => {
    state.roleList = data.list;
    state.total = data.total;
    state.loading = false;
  });
}

function resetQuery() {
  queryFormRef.value.resetFields();
  handleQuery();
}

function handleSelectionChange(selection: any) {
  state.ids = selection.map((item: any) => item._id);
  state.single = selection.length !== 1;
  state.multiple = !selection.length;
}

function handleRowClick(row: any) {
  if(row.role == 'ROOT')return;
  emit('roleClick', row);
}

function handleAdd() {
  state.dialog = {
    title: '添加角色',
    visible: true,
  };
}

function handleUpdate(row: any) {
  console.log(row)
  state.dialog = {
    title: '修改角色',
    visible: true,
  };
  const roleId = row._id || state.ids;
  getRoleFormDetail(roleId).then(({ data }) => {
    state.formData = data;
  });
}

function submitForm() {
  dataFormRef.value.validate((valid: any) => {
    if (valid) {
      if (state.formData._id) {
        updateRole(state.formData._id as any, state.formData).then(() => {
          ElMessage.success('修改成功');
          cancel();
          handleQuery();
        });
      } else {
        addRole(state.formData).then(() => {
          ElMessage.success('新增成功');
          cancel();
          handleQuery();
        });
      }
    }
  });
}

/**
 * 重置表单
 */
function cancel() {
  state.dialog.visible = false;
  dataFormRef.value.resetFields();
}

function handleDelete(row: any) {
  const ids = [row._id || state.ids].join(',');
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteRoles(ids).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleAdd" v-hasPerm="['sys:role:add']"
          >新增</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPerm="['sys:role:del']"
          >删除</el-button
        >
      </el-form-item>

      <el-form-item prop="roleName">
        <el-input
          v-model="queryParams.roleName"
          placeholder="角色名称"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" :icon="Search" @click="handleQuery"
          >搜索</el-button
        >
        <el-button :icon="Refresh" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 数据表格 -->
    <el-table
      ref="dataTableRef"
      v-loading="loading"
      :data="roleList"
      @selection-change="handleSelectionChange"
      @row-click="handleRowClick"
      highlight-current-row
      border
    >
      <el-table-column type="selection" width="55" align="center" :selectable="selectEnable"/>
      <el-table-column label="角色名称" prop="roleName" />
      <el-table-column label="角色编码" prop="role" />
      <el-table-column label="操作" align="center" width="120">
        <template #default="scope">
          <el-button
            v-if="scope.row.role != 'ROOT'"
            type="primary"
            v-hasPerm="['sys:role:update']"
            :icon="Edit"
            circle
            plain
            @click.stop="handleUpdate(scope.row)"
          />
          <el-button
            v-if="scope.row.role != 'ROOT'"
            type="danger"
            v-hasPerm="['sys:role:del']"
            :icon="Delete"
            circle
            plain
            @click.stop="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页工具条 -->
    <pagination
      v-if="total > 0"
      :total="total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="handleQuery"
    />

    <!-- 表单弹窗 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      @close="cancel"
      width="450px"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="formData.roleName" placeholder="请输入角色名称" />
        </el-form-item>

        <el-form-item label="角色编码" prop="role">
          <el-input v-model="formData.role" placeholder="请输入角色编码" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            controls-position="right"
            :min="0"
            style="width: 100px"
          />
        </el-form-item>

        <el-form-item label="状态">
          <el-radio-group v-model="formData.status">
            <el-radio label="1">正常</el-radio>
            <el-radio label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped></style>
