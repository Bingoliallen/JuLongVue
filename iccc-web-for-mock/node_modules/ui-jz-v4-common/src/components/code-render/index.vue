<script>
import parser from "./parser";
import compiler from "./compiler";
import Preview from "./preview";
export default {
    name: "CodeRender",
    props: {
        scope: Object,
        value: {
            type: String,
            required: true
        }
    },
    methods: {
        executeCode(code) {
            const result = parser(code);
            // 解析失败
            if (result.error) {
                this.$emit("error", result.error);
                return {};
            }

            const compiledCode = compiler(result, this.scope);
            // 编译失败
            if (compiledCode.error) {
                this.$emit("error", compiledCode.error);
                return;
            }
            return {
                preview: compiledCode.result,
                styles: compiledCode.styles
            };
        }
    },
    render(h) {
        const { styles, preview } = this.executeCode(this.value);
        return h(Preview, {
            props: {
                value: preview,
                styles: styles
            },
            on: {
                error: e => {
                    this.$emit("error", e);
                }
            }
        });
    }
};
</script>
