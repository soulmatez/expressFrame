<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
export default {
  name: 'handle',
};
</script>

<script setup lang="ts">
import {
    listLogPages,
    deleteLog
} from '@/api/system/log';
import { Search, Plus, Edit, Refresh, Delete, Histogram } from '@element-plus/icons-vue';
import { onMounted, reactive, getCurrentInstance, ref, toRefs } from 'vue';
import { ElForm, ElMessage, ElMessageBox } from 'element-plus';
import { LogQueryParam, Option, LogItem, LogFormData } from '@/types';
import { format } from '@/utils/index';
const { proxy }: any = getCurrentInstance();

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
const state = reactive({
  loading: true,
  // 选中ID数组
  ids: [],
  // 非单个禁用
  single: true,
  // 非多个禁用
  multiple: true,
  jsonData:{
    params: {},
    query: {},
    body: {}
  } as any,
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    handleType: 1,
    handleUser: '',
    postType: '',
    systemCode: ''
  } as LogQueryParam,
  logList: [] as LogItem[],
  total: 0,
  dialog: {
    title: '请求数据展示',
    visible: false,
    type: 'create',
  },
  formData: {} as LogItem,
  rules: {
    clientId: [
      { required: true, message: '客户端ID不能为空', trigger: 'blur' },
    ],
  },
  authorizedGrantTypesOptions: [] as Option[],
  checkedAuthorizedGrantTypes: [] as string[],
  microServiceOptions: [] as Option[],
  requestMethodOptions: [] as Option[]
});

const {
  loading,
  ids,
  multiple,
  queryParams,
  logList,
  total,
  dialog,
  formData,
  jsonData,
  rules,
  authorizedGrantTypesOptions,
  checkedAuthorizedGrantTypes,
  microServiceOptions, 
  requestMethodOptions
} = toRefs(state);

function handleQuery() {
    listLogPages(state.queryParams).then(({ data }) => {
    state.logList = data.list;
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

function resetForm() {
  dataFormRef.value.resetFields();
  state.checkedAuthorizedGrantTypes = [];
}

function handleShowBody(row: any){
  state.dialog.visible = true;
  state.formData = { ...row }
  state.jsonData.params = { ...row.handBody.params }
  state.jsonData.query = { ...JSON.parse(row.handBody.query) }
  state.jsonData.body = { ...JSON.parse(row.handBody.body) }
}

function submitForm(){
  ElMessage.info('功能内测中');
}

function cancel(){
  state.dialog.visible = false;
}

function handleDelete(row: any) {
  const logIds = [row._id || state.ids].join(',');
  ElMessageBox.confirm('确认删除已选中的数据项?', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(() => {
      deleteLog(logIds).then(() => {
        ElMessage.success('删除成功');
        handleQuery();
      });
    })
    .catch(() => ElMessage.info('已取消删除'));
}

// 过滤字典数据


// 加载字典
function loadDictQuery() {
    //微服务字典
    proxy.$listDictsByCode('micro_service').then((response: any) => {
        state.microServiceOptions = response.data;
    });
    //微服务字典
    proxy.$listDictsByCode('request_method').then((response: any) => {
        state.requestMethodOptions = response.data;
    });
}

onMounted(() => {
  handleQuery();
  loadDictQuery();
});
</script>

<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <el-form ref="queryFormRef" :model="queryParams" :inline="true">
      <el-form-item>
        <el-button
          type="danger"
          :icon="Delete"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPerm="['sys:log:handle:del']"
          >删除</el-button>
      </el-form-item>

      <el-form-item prop="status">
            <el-select
            v-model="queryParams.systemCode"
            placeholder="请选择所属模块"
            clearable
            style="width: 200px"
            >
            <el-option v-for="(item, index) in state.microServiceOptions" :key="index" :label="item.name" :value="item.value" />
            </el-select>
      </el-form-item>

      <el-form-item prop="status">
            <el-select
            v-model="queryParams.postType"
            placeholder="请选择请求方式"
            clearable
            style="width: 200px"
            >
            <el-option v-for="(item, index) in state.requestMethodOptions" :key="index" :label="item.name" :value="item.value" />
            </el-select>
      </el-form-item>

      <el-form-item prop="handleUser">
        <el-input
          v-model="queryParams.handleUser"
          placeholder="请输入操作人员"
          clearable
          style="width: 240px"
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
      v-loading="loading"
      :data="logList"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="编号" type="index" width="85" align="center" />
      <el-table-column label="系统模块" prop="systemCode" width="180" align="center" >
        <template #default="scope">
            {{ microServiceOptions.filter((item) => item.value == scope.row.systemCode)[0].name }}
        </template>
      </el-table-column>
      
      <!-- <el-table-column label="操作类型" prop="clientSecret" width="100" /> -->
      <el-table-column label="请求方式" width="150" prop="postType" align="center" >
        <template #default="scope">
            <el-tag
                :type="scope.row.postType == 'post' ? '' : scope.row.postType == 'put' ? 'warning' : 'danger'"
                class="mx-1"
                round
                >{{ scope.row.postType }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作人员" prop="handleUser" width="150" align="center" />
      <el-table-column label="主机" prop="handleHost" align="center" width="150"/>
      <el-table-column label="操作地点" prop="handleLocal" width="150" align="center"/>
      <el-table-column label="操作内容" prop="handleDesc"  align="center" width="250"/>
      <el-table-column label="操作状态" prop="handleStatus"  align="center">
        <template #default="scope">
            <el-icon :color="scope.row.handleStatus == 200 ? 'green' : '#ff5d5d'" size="20">
                <CircleCheckFilled v-if="scope.row.handleStatus == 200" />
                <CircleClose v-else />
            </el-icon>
        </template>
      </el-table-column>
      <el-table-column label="操作时间" prop="handleTime" align="center" width="250">
        <template #default="scope">
            {{ format('YYYY-MM-DD HH:mm:ss', scope.row.handleTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150">
        <template #default="scope">
          <el-button
            type="warning"
            :icon="Histogram"
            circle
            plain
            @click.stop="handleShowBody(scope.row)"
          />
          <el-button
            type="danger"
            :icon="Delete"
            circle
            plain
            v-hasPerm="['sys:log:handle:del']"
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

     <!-- 用户表单 -->
     <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="600px"
      append-to-body
      @close="cancel"
    >
    <el-form-item label="操作目的：">
      <el-input readonly v-model="formData.handleDesc" placeholder="Please input"></el-input>
    </el-form-item>
    <el-form-item label="请求地址：">
      <el-input v-model="formData.handBody.url" placeholder="Please input">
        <template #prepend>{{ formData.postType }}</template>
      </el-input>
    </el-form-item>
    <el-form-item label="请求参数：">
      <JsonViewer style="width:100%" :value="jsonData.body" copyable boxed sort />
    </el-form-item> 
      
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="submitForm">测  试</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
