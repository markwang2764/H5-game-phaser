# 白底样式toast

## 使用方法

```
toast.make({
  type: 'error', 
  title: '兑换失败', // toast 标题
  content: '请重试' // toast 内容
}, time);  
```
## 参数
### 1. type    
  toast类型,显示对应的图标  
  可选值: 'success', 'error', 'info'   
  默认值: 'info'   
### 2. title  
标题   
### 3. content
显示内容
### 4. time   
toast展示时间  
默认值：2000



