import DefaultBuilder from "./DefaultBuilder";

export default {
  name: "Builder",
  props: ["filter", "fields", "parent"],
  inject: [
    "addRule",
    "addGroup",
    "changeGroupType",
    "setField",
    "setOperation",
    "setValue",
    "componentMap",
    "removeRule"
  ],
  computed: {
    subfilter() {
      return this.parent && this.parent.filter;
    }
  },
  methods: {
    getField(field) {
      return this.fields.find(x => x.name === field);
    },
    componentForRule(rule) {
      return this.componentMap[rule.type] || "input";
    }
  },
  render(h) {
    if (!this.$scopedSlots.default) {
      return h(DefaultBuilder, {
        props: {
          fields: this.fields,
          filter: this.filter,
          subfilter: this.subfilter
        }
      });
    }

    const vnode = this.$scopedSlots.default({
      fields: this.fields,
      getField: this.getField,
      filter: this.filter,
      componentForRule: this.componentForRule,
      addRule: this.addRule,
      addGroup: this.addGroup,
      changeGroupType: this.changeGroupType,
      setField: this.setField,
      setOperation: this.setOperation,
      setValue: this.setValue,
      subfilter: this.subfilter,
      removeRule: this.removeRule
    });

    const injectSlot = vnode => {
      if (
        vnode.componentOptions &&
        vnode.componentOptions.Ctor.options.name === "Builder"
      ) {
        vnode.data.scopedSlots = {
          default: this.$scopedSlots.default
        };
      }
      if (vnode.children) {
        for (const child of vnode.children) {
          injectSlot(child);
        }
      }
    };

    injectSlot(vnode);

    return h("div", [vnode]);
  }
};
