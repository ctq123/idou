<span v-if="isShowSubmit(record['status'])" slot="footer" class="dialog-footer">
  <el-button @click="detailModalShow=false">取消</el-button>
  <el-button
    type="primary"
    @click="handleEdit(record)"
  >
    再次提交
  </el-button>
</span>