<template>
	<div style="padding: 0 20px 40px 0">
		<a
			v-for="item in options"
			:key="'area_' + item.value"
			class="area"
			:class="select.includes(item.value) ? 'active' : ''"
		>
			{{ item.label }}
			<template v-if="item.children.length > 0">
				<div class="detail">
					<a
						v-for="key in item.children"
						:key="'area_detail_' + item.value + key.value"
						class="detail-item"
						:class="select.includes(key.value) ? 'active' : ''"
						@click="handleSelect(key, item)"
					>
						{{ key.label }}
					</a>
				</div>
			</template>
		</a>
	</div>
</template>

<script>
import { Family } from '@/api'

export default {
	name: 'Area',
	props: {
		value: {
			type: Array,
			default() {
				return []
			}
		}
	},
	data() {
		return {
			select: this.value,
			options: []
		}
	},
	watch: {
		value(val) {
			this.select = val
		}
	},
	created() {
		this.getOpts()
	},
	methods: {
		getOpts() {
			let params = {
				rc_id: '01'
			}
			Family.familyDistrictFind(params).then(res => {
				if (res.data) {
					let arr = res.data.filter(v => {
						return v.rc_pid === '1'
					}).map(v => {
						return {
							label: v.district,
							value: v.rc_id,
							children: []
						}
					})
					arr.forEach(item => {
						res.data.forEach(key => {
							if (item.value === key.rc_pid) {
								item.children.push({
									label: key.district,
									value: key.rc_id
								})
							}
						})
					})
					this.options = arr.sort((a, b) => {
						return parseInt(a.value) - parseInt(b.value)
					})
				}
			})
		},
		handleSelect(key, item) {
			this.select = [item.value, key.value]
			this.$emit('input', this.select)
			this.$emit('change', key, item)
		}
	}
}
</script>

<style lang="less" scoped>
.area {
	position: relative;
	display: inline-block;
	height: 37px;
	line-height: 37px;
	width: 120px;
	text-align: center;
	color: #000;
	cursor: pointer;
	border: 1px solid transparent;
	&:hover {
		border-left: 1px solid #ddd;
		border-top: 1px solid #ddd;
		border-right: 1px solid #ddd;
		border-bottom: 1px solid transparent;
		.detail {
			display: block;
		}
	}
}
.active {
	color: #1890ff !important;
}
.detail {
	z-index: 10;
	display: none;
	position: absolute;
	top: 37px;
	left: -1px;
	width: 15vw;
	text-align: left;
	border: 1px solid #ddd;
	border-top: none;
	background-color: #fff;
	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 120px;
		width: calc(15vw - 120px);
		height: 1px;
		background-color: #ddd;
	}
	.detail-item {
		display: inline-block;
		padding: 5px;
		color: #000;
		cursor: pointer;
	}
}
</style>
