<template>
    <div class="digit-chart">
        <div v-for="(percent, i) in digits" :key="i" class="digit">
            <strong :class="{ 'digit-label': true, 'digit-label-best': i === winner }">{{
                i
            }}</strong>
            <span class="digit-percent">{{ Math.round(percent * 100) + '%' }}</span>
            <span class="digit-bar">
                <span :style="{ width: percent * 100 + '%' }"></span>
            </span>
        </div>
    </div>
</template>

<script>
const testData = Array(10).fill(0);
//.map(() => Math.random());

export default {
    name: 'digit-chart',
    props: {
        digits: {
            type: Array,
            default: () => {
                return testData;
            }
        }
    },
    computed: {
        hasValues() {
            return Math.max(...this.digits) > 0;
        },
        winner() {
            if (this.digits && this.digits.length && this.hasValues) {
                const max = Math.max(...this.digits);
                return this.digits.indexOf(max);
            }
            return null;
        }
    }
};
</script>

<style lang="scss">
.digit-chart {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    min-width: 300px;
    gap: 4px;
    .digit {
        display: flex;
        align-items: center;
        gap: 6px;

        .digit-label {
            display: block;
            width: 20px;
            height: 20px;
            background-color: black;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 0;
        }

        .digit-label-best {
            background-color: var(--yellow);
            color: black;
        }

        .digit-percent {
            display: block;
            width: 3em;
            text-align: right;
        }

        .digit-bar {
            display: block;
            position: relative;
            height: 4px;

            flex: 1;
            background-color: rgba(black, 0.1);

            > span {
                position: absolute;
                left: 0;
                height: 100%;
                border-radius: inherit;
                background-color: var(--yellow);
            }
        }
    }
}
</style>
