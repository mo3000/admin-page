<template>
  <d2-container type="card">
    <template>
      <el-form :inline="true" :model="formSearch" ref="searchRef">
        <el-form-item label="用户名">
          <el-input v-model="formSearch.username"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formSearch.realname"></el-input>
        </el-form-item>
        <el-button  @click="resetSearchForm()">重置</el-button>
        <el-button type="primary" @click="listSearch">查询</el-button>
        <el-button type="primary" @click="onAdminAdd">添加</el-button>
      </el-form>
      <el-table :data="tableData" border>
        <el-table-column prop="username" label="用户名"/>
        <el-table-column prop="realname" label="姓名"/>
        <el-table-column label="角色">
          <template slot-scope="s">
            {{s.row.roles.map(x => x['display_name']).join(',')}}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="s">
            {{s.row.status == 1 ? '正常' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="s">
            <el-button @click="onAdminEdit(s.row)">编辑</el-button>
            <el-button @click="onToggleAdminStatus(s.row.id)">{{s.row.status == 1 ? '禁用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        :current-page="page"
        :total="total"
        :page-size="15"
        @current-change="onPageChange"
      />
      <!--添加用户begin-->
      <el-dialog
        title=""
        :visible.sync="showModalAddAdmin"
      >
        <el-form :model="adminEditData" ref="adminAddRef" :rules="adminAddRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="adminEditData.username"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realname" >
            <el-input v-model="adminEditData.realname"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="adminEditData.password" placeholder="不填则使用默认密码：123456"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roles">
            <el-checkbox-group v-model="adminEditData.roles">
              <el-checkbox v-for="role in roles" :label="role.name">
                {{role.display_name}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" >
          <el-button @click="showModalAddAdmin=false">取 消</el-button>
          <el-button type="primary" @click="onAdminEditCommit" :loading="formLoading">确 定</el-button>
        </span>
      </el-dialog>
      <!--添加用户end-->
      <!--编辑用户begin-->
      <el-dialog
        title=""
        :visible.sync="showModalEditAdmin"
      >
        <el-form :model="adminEditData" ref="adminEditRef" :rules="adminEditRules">
          <el-form-item label="用户名" >
            <el-input v-model="adminEditData.username" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="姓名" prop="realname">
            <el-input v-model="adminEditData.realname"></el-input>
          </el-form-item>
          <el-form-item label="角色" prop="roles">
            <el-checkbox-group v-model="adminEditData.roles">
              <el-checkbox v-for="role in roles" :label="role.name">
                {{role.display_name}}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-form>
        <span slot="footer" >
          <el-button @click="showModalEditAdmin=false">取 消</el-button>
          <el-button type="primary" @click="onAdminEditCommit" :loading="formLoading">确 定</el-button>
        </span>
      </el-dialog>
      <!--编辑用户end-->
    </template>
  </d2-container>
</template>

<script>
const defaultAdminData = {
  id: null,
  realname: '',
  username: '',
  password: '',
  roles: [],
};
const defaultSearchData = {
  username: '',
  realname: '',
};
export default {
  data() {
    return {
      formSearch: {...defaultSearchData},
      adminEditData: {...defaultAdminData},
      tableData: [],
      page: 1,
      total: 0,
      showModalAddAdmin: false,
      showModalEditAdmin: false,
      roles: [
        {name: 'admin', display_name: '管理员'},
        {name: 'merchant', display_name: '商户'},
      ],
      formLoading: false,
      adminAddRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'change'},
          {min: 3, max: 15, message: '长度在3到15个字符', trigger: 'change'},
        ],
        realname: [
          {required: true, message: '请输入姓名（昵称）', trigger: 'blur'},
          {max: 20, message: '长度在20个字符以内', trigger: 'change'},
        ],
        password: [
          {min: 6, max: 20, message: '长度在6到20个字符', trigger: 'change'},
        ],
        roles: [
          {required: true, message: '请选择角色', trigger: 'change'},
        ],
      },
      adminEditRules: {
        realname: [
          {required: true, message: '请输入姓名（昵称）', trigger: 'blur'},
          {max: 20, message: '长度在20个字符以内', trigger: 'change'},
        ],
        roles: [
          {required: true, message: '请选择角色', trigger: 'change'},
        ],
      },
    };
  },
  mounted() {
    this.onListSearch();
  },
  methods: {
    resetSearchForm() {
      this.formSearch = {...defaultSearchData};
      this.page = 1;
    },
    listSearch() {
      this.page = 1;
      this.onListSearch();
    },
    onListSearch() {
      this.$api.RBAC_ADMIN_LOAD_LIST({...this.formSearch})
        .then(res => {
          this.tableData = res.data;
          this.total = res.total;
          this.page = res.current_page;
        });
    },
    onPageChange(page) {
      this.page = page;
      this.onListSearch();
    },
    clearAdminEdit() {
      this.adminEditData = defaultAdminData;
    },
    onAdminAdd() {
      this.clearAdminEdit();
      this.showModalAddAdmin = true;
    },
    onAdminEdit(data) {
      const roles = data.roles.map(x => x.name);
      this.adminEditData = {...data, roles};
      this.showModalEditAdmin = true;
    },
    onAdminEditCommit() {
      if (this.adminEditData.id) {
        //编辑
        this.$refs['adminEditRef'].validate(valid => {
          if (! valid) return false;
          this.formLoading = true;
          this.$api.RBAC_ADMIN_EDIT({...this.adminEditData})
            .then(() => {
              this.showModalEditAdmin = false;
              this.formLoading = false;
              this.onListSearch();
            })
            .catch(e => {
              this.formLoading = false;
            });
        });
      } else {
        //添加
        this.$refs['adminAddRef'].validate(valid => {
          if (! valid) return false;
          this.formLoading = true;
          this.$api.RBAC_ADMIN_EDIT({...this.adminEditData})
            .then(data => {
              this.showModalAddAdmin = false;
              this.formLoading = false;
              this.onListSearch();
            })
            .catch(data => {
              this.formLoading = false;
            });
        });
      }

      // this.showModalAddAdmin = false;
    },
    onToggleAdminStatus(id) {
      this.$api.RBAC_ADMIN_TOGGLE_STATUS(id)
        .then(() => {
          this.onListSearch();
        });
    },
  }

};
</script>
