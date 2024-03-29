<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button type="success" :icon="Plus" @click="handleAdd" v-hasPerm="['sys:dictItem:add']"
          >新增</el-button
        >
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPerm="['sys:dictItem:del']"
          >删除</el-button
        >
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="数据项名称"
          clearable
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
      :data="dictItemList"
      v-loading="loading"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" min-width="20px" />
      <el-table-column label="数据项名称" prop="name" />
      <el-table-column label="数据项值" prop="value" />
      <el-table-column label="状态" align="center">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="info">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            type="primary"
            :icon="Edit"
            circle
            plain
            v-hasPerm="['sys:dictItem:update']"
            @click.stop="handleUpdate(scope.row)"
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            v-hasPerm="['sys:dictItem:del']"
            @click.stop="handleDelete(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

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
      width="500px"
      @close="cancel"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="字典名称"> </el-form-item>
        <el-form-item label="字典项名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入字典项名称" />
        </el-form-item>
        <el-form-item label="字典项值" prop="value">
          <el-input v-model="formData.value" placeholder="请输入字典项值" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number
            v-model="formData.sort"
            style="width: 80px"
            controls-position="right"
            :min="0"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" type="textarea"></el-input>
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

<script setup lang="ts">
import { onMounted, reactive, ref, toRefs, watch } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import {
  Dialog,
  DictItem,
  DictItemFormData,
  DictItemQueryParam,
} from '@/types';
import {
  listDictItemPages,
  getDictItemDetail,
  addDictItem,
  updateDictItem,
  deleteDictItem,
} from '@/api/system/dict';
import { Search, Plus, Edit, Refresh, Delete } from '@element-plus/icons-vue';

const props = defineProps({
  dictCode: {
    type: String,
    default: () => {
      return '';
    },
  },
  dictName: {
    type: String,
    default: () => {
      return '';
    },
  },
});

watch(
  () => props.dictCode,
  (value) => {
    state.queryParams.dictCode = value;
    state.formData.dictCode = value;
    handleQuery();
  }
);

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const state = reactive({
  loading: true,
  // 选中ID数组
  ids: [] as number[],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  total: 0,
  queryParams: { pageNum: 1, pageSize: 10 } as DictItemQueryParam,
  dictItemList: [] as DictItem[],
  dialog: { visible: false } as Dialog,
  formData: {
    dictCode: props.dictCode,
    dictName: props.dictName,
    status: 1,
    sort: 1,
  } as DictItemFormData,
  rules: {
    name: [{ required: true, message: '请输入字典项名称', trigger: 'blur' }],
    value: [{ required: true, message: '请输入字典项值', trigger: 'blur' }],
  },
  localDictCode: props.dictCode,
  localDictName: props.dictName,
});

const {
  loading,
  multiple,
  queryParams,
  dictItemList,
  dialog,
  formData,
  rules,
  total,
} = toRefs(state);

function handleQuery() {
  if (state.queryParams.dictCode) {
    state.loading = true;
    listDictItemPages(state.queryParams).then(({ data }) => {
      state.dictItemList = data.list;
      state.total = data.total;
      state.loading = false;
    });
  } else {
    state.dictItemList = [];
    state.total = 0;
    state.queryParams.pageNum = 1;
    state.loading = false;
  }
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

function handleAdd() {
  if (!state.formData.dictCode) {
    ElMessage.warning('请选择字典后添加数据项');
    return;
  }
  state.dialog = {
    title: '添加字典项',
    visible: true,
  };
}

function handleUpdate(row: any) {
  state.dialog = {
    title: '修改字典项',
    visible: true,
  };
  const data = JSON.parse(JSON.stringify(row));
  // const id = row._id || state.ids;
  // getDictItemDetail(id).then(({ data }) => {});
  state.formData = data;
}

function submitForm() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      console.log(state.formData._id);
      if (state.formData._id) {
        updateDictItem({ dictItemId: state.formData._id, dictCode: props.dictCode }, state.formData).then(() => {
          ElMessage.success('修改成功');
          cancel();
          handleQuery();
        });
      } else {
        addDictItem(state.formData).then(() => {
          ElMessage.success('新增成功');
          cancel();
          handleQuery();
        });
      }
    }
  });
}

function cancel() {
  state.dialog.visible = false;
  state.formData._id = undefined;
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
      deleteDictItem(props.dictCode, ids).then(() => {
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
