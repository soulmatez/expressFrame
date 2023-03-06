<!--
 * @Author: Soulmate
 * @Date: 2023-02-22 11:12:54
 * @LastEditTime: 2023-02-24 15:45:18
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\views\system\menu\index.vue
 * 版权声明
-->
<template>
  <div class="app-container">
    <el-row :gutter="10">
      <el-col :span="10" :xs="24">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon icon-class="menu" />
            菜单列表
          </template>
          <menu-table @menuClick="handleMenuClick" />
        </el-card>
      </el-col>
      <el-col :span="14" :xs="24">
        <el-card class="box-card" shadow="always">
          <template #header>
            <svg-icon icon-class="perm" />
            <span style="margin: 0 5px">权限列表</span>
            <el-tag type="success" v-if="menuId" size="small">{{
              menuName
            }}</el-tag>
            <el-tag type="warning" v-else size="small"
              >请点击左侧菜单列表选择</el-tag
            >
          </template>
          <perm-table :menuId="menuId" :menuName="menuName" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
import MenuTable from './components/Menu.vue';
import PermTable from './components/Perm.vue';

import { reactive, toRefs } from 'vue';

const state = reactive({
  menuId: undefined,
  menuName: '',
});

const { menuId, menuName } = toRefs(state);

function handleMenuClick(menuRow: any) {
  if (menuRow) {
    state.menuId = menuRow._id;
    state.menuName = menuRow.label;
  } else {
    state.menuId = undefined;
    state.menuName = '';
  }
}
</script>

<style scoped></style>
