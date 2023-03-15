/*
 * @Author: Soulmate
 * @Date: 2023-02-09 09:39:25
 * @LastEditTime: 2023-03-15 15:36:24
 * @LastEditors: Soulmate
 * @Description: 
 * @FilePath: \template\src\shims-vue.d.ts
 * 版权声明
 */
declare module "@types/three";

declare module 'vue3-json-viewer' {
    import { AllowedComponentProps, App, Component, ComponentCustomProps, VNodeProps } from 'vue'
    interface JsonViewerProps {
        value: Object | Array<any> | string | number | boolean; //对象
        expanded: boolean; //是否自动展开
        expandDepth: number; //展开层级
        copyable: boolean | object; //是否可复制
        sort: boolean;//是否排序
        boxed: boolean;//是否boxed
        theme: string;//主题 dark | light
        previewMode: boolean;//是否可复制
        timeformat: (value: any) => string
    }
    type JsonViewerType = JsonViewerProps & VNodeProps & AllowedComponentProps & ComponentCustomProps
    const JsonViewer: Component<JsonViewerType>
    export { JsonViewer }
    const def: { install: (app: App) => void }
    export default def
}