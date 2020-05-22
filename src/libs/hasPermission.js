/* vue自定义指令 */
const hasPermission = {
    install: function (Vue, options) {
        Vue.directive('has', {
            bind(el, binding, vnode) {
                let permTypes = vnode.context.menuBtns;
                // console.log(vnode.context.menuBtns);
                // if()
                // console.log(vnode.context)
                if (!permTypes.includes(binding.value)) {
                    vnode.context.$nextTick(() =>
                        el.parentNode.removeChild(el)
                    );
                }
            }
        });
    }
};

export default hasPermission;
