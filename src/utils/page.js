/**
 * 获取当前路由
 */
export const getCurrentRoute = () => {
  return location.pathname
}

/**
 * 路由跳转
 */
export const pageJump = (router , path) => {
  console.log("jump page", path)
  router.push(path)
};