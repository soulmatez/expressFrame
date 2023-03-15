/*
 * @Author: Soulmate
 * @Date: 2022-06-17 14:18:28
 * @LastEditTime: 2023-03-15 13:30:56
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\main.ts
 * 版权声明
 */
import { createApp, Directive } from 'vue'
import App from './App.vue'
import router from '@/router'

import { createPinia } from 'pinia';
import '@/permission';

// 自定义样式
import '@/style/index.scss';

// 引入elementUI-PLUS
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import Pagination from '@/components/Pagination/index.vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 根据字典编码获取字典列表全局方法
import { listDictsByCode } from '@/api/system/dict';

// 引入svg注册脚本
import 'virtual:svg-icons-register';

// 国际化
import i18n from '@/lang/index';

// Json代码块展示
import JsonViewer from 'vue3-json-viewer';
//添加样式
import "vue3-json-viewer/dist/index.css";

const app = createApp(App);

// 全局方法
app.config.globalProperties.$listDictsByCode = listDictsByCode;

// 全局注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 自定义指令
import * as directive from '@/directive';
Object.keys(directive).forEach((key) => {
  app.directive(key, (directive as { [key: string]: Directive })[key]);
});


    app
    .component('Pagination', Pagination)
    .use(createPinia())
    .use(i18n)
    .use(router)
    .use(JsonViewer)
    .use(ElementPlus).mount('#app')
