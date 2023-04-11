<!-- setup 无法设置组件名称，组件名称keepAlive必须 -->
<script lang="ts">
export default {
  name: "handle",
};
</script>

<script setup lang="ts">
import { listLogPages, deleteLog } from "@/api/system/log";
import { Search, Plus, Edit, Refresh, Delete } from "@element-plus/icons-vue";
import { onMounted, reactive, getCurrentInstance, ref, toRefs } from "vue";
import { ElForm, ElMessage, ElMessageBox } from "element-plus";
import { LogQueryParam, Option, LogItem, LogFormData } from "@/types";
import { format } from "@/utils/index";
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
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    handleType: 2,
    handleUser: "",
    postType: "",
    systemCode: "",
  } as LogQueryParam,
  logList: [] as LogItem[],
  total: 0,
  dialog: {
    title: "",
    visible: false,
    type: "create",
  },
  formData: {} as LogFormData,
  rules: {
    clientId: [
      { required: true, message: "客户端ID不能为空", trigger: "blur" },
    ],
  },
  authorizedGrantTypesOptions: [] as Option[],
  checkedAuthorizedGrantTypes: [] as string[],
  microServiceOptions: [] as Option[],
  requestMethodOptions: [] as Option[],
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
  rules,
  authorizedGrantTypesOptions,
  checkedAuthorizedGrantTypes,
  microServiceOptions,
  requestMethodOptions,
} = toRefs(state);

function handleQuery() {
  listLogPages(state.queryParams).then(({ data }) => {
    state.logList = data.list;
    state.logList.map((item: LogItem)  => item.handleTime = format("YYYY-MM-DD HH:mm:ss", item.handleTime as any))
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

function handleDelete(row: any) {
  const logIds = (row._id || state.ids).join(",");
  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      deleteLog(logIds).then(() => {
        ElMessage.success("删除成功");
        handleQuery();
      });
    })
    .catch(() => ElMessage.info("已取消删除"));
}

// 过滤字典数据

// 加载字典
function loadDictQuery() {
  //微服务字典
  proxy.$listDictsByCode("micro_service").then((response: any) => {
    state.microServiceOptions = response.data;
  });
  //微服务字典
  proxy.$listDictsByCode("request_method").then((response: any) => {
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
    <el-row :gutter="10">
      <el-col :span="18" :xs="24">
        <el-card class="box-card" shadow="always">
          <!-- 搜索表单 -->
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item>
              <el-button
                type="danger"
                :icon="Delete"
                :disabled="multiple"
                @click="handleDelete"
                v-hasPerm="['sys:log:login:del']"
                >删除</el-button
              >
            </el-form-item>

            <el-form-item prop="handleUser">
              <el-input
                v-model="queryParams.handleUser"
                placeholder="请输入用户"
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
            <el-table-column
              label="编号"
              type="index"
              width="85"
              align="center"
            />
            <el-table-column
              label="用户"
              prop="handleUser"
              width="150"
              align="center"
            />
            <el-table-column
              label="主机"
              prop="handleHost"
              align="center"
              width="150"
            />
            <el-table-column
              label="操作地点"
              prop="handleLocal"
              width="150"
              align="center"
            />
            <el-table-column
              label="操作内容"
              prop="handleDesc"
              align="center"
              width="250"
            />
            <el-table-column
              label="操作详情"
              prop="handleStatus"
              align="center"
            >
              <template #default="scope">
                <el-icon
                  :color="scope.row.postType == 'post' ? 'green' : '#ff5d5d'"
                  size="20"
                >
                  <CircleCheckFilled v-if="scope.row.postType == 'post'" />
                  <CircleClose v-else />
                </el-icon>
              </template>
            </el-table-column>
            <el-table-column
              label="操作时间"
              prop="handleTime"
              align="center"
              width="250"
            >
              <template #default="scope">
                {{ format("YYYY-MM-DD HH:mm:ss", scope.row.handleTime) }}
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
        </el-card>
      </el-col>
      <el-col :span="6" :xs="24" >
        <el-card class="box-card" shadow="always" style="height: 800px;overflow-y: scroll;"> 
            <el-timeline>
                <template v-for="(item, index) in logList" :key="index">
                    <el-timeline-item :timestamp="item.handleTime.toString()" placement="top" :icon="item.postType == 'post' ? 'Connection' : 'SwitchButton'" :color="item.postType == 'post' ? 'green' : '#ff5d5d'">
                        <el-card shadow="always">
                            <h4>用户： {{ item.handleUser }}</h4>
                            <p>{{ item.handleDesc }}</p>
                        </el-card>
                    </el-timeline-item>
                </template>
            </el-timeline>    
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
