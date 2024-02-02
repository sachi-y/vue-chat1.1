<template>
    <!-- vuetifyはv-appで囲まないと、cssが反映されないのでつけとく。 -->
    <v-app>
        <div class="login-box">
            <v-card class="login-form">
                <v-card-title class="login-title">SignUp</v-card-title>
                <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
                <v-btn text color="light-blue" to="login">ログイン画面はこちら</v-btn>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    >
                    <!-- :コロンがあると変数扱い、なしは文字列扱いに注意 -->
                    <v-text-field
                        v-model="name"
                        :rules="nameRules"
                        label="UserName"
                        required
                    ></v-text-field>

                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="E-mail"
                        required
                    ></v-text-field>
                <!-- v-model: dataの中にある同名のものと紐づく -->
                    <v-text-field
                        v-model="password"
                        type="password"
                        label="Password"
                    ></v-text-field>

                    <v-btn
                    color="success"
                    class="login-btn"
                    @click="submit"
                    :disabled="isValid">
                        SIGN UP
                    </v-btn>
                    <v-btn>
                        CLEAR
                    </v-btn>
                    <v-alert
                    dense
                    outlined
                    type="error"
                    class="error-message"
                    v-if="errorMessage"
                    >
                        {{ errorMessage }}
                    </v-alert>
                </v-form>
            </v-card>
        </div>

    </v-app>
</template>

<script>
import firebase from "../firebase/firebase"

export default {
  data: () => ({
    // v-form内で、v-model="valid"と定義されている
    //バリデーション(入力の正常性判断)が正しいときは、true
    valid: true,
    name: '',
    nameRules: [
      v => !!v || '名前を入力してください',
      v => (v && v.length <= 10) || '名前は10文字以内で入力してください',
    ],
    email: '',
    // vuetifyによるテンプレート↓
    emailRules: [
      v => !!v || 'メールアドレスを入力してくだい',
      v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です',
    ],
    password:'',
    errorMessage:'',
  }),
  computed: {
    // ボタンの活性・非活性
    isValid() {
        console.log("isValid", this.valid);
        return !this.valid;
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    resetValidation () {
      this.$refs.form.resetValidation()
    },
    submit() {
        console.log("submit call")
        //認証
        firebase.auth()
        // thisで入力したものを取得
        //firebaseのauth()に用意されているcreateUserWithEmailAndPasswordメソッドを使用
        .createUserWithEmailAndPassword(this.email, this.password)
        //成功した場合の処理
        .then(async (result) => {
            console.log("success", result)
            //firebaseのupdateProfileメソッドを使ってユーザー情報を更新する
            await result.user.updateProfile(
                {displayName: this.name}
            )
            console.log("update user", result.user)

            //ローカルストレージにメッセージを保存して、新規作成に成功した場合にメッセージを表示
            localStorage.message = "新規作成に成功しました"

            //TOPにリダイレクト vue-routerの処理
            this.$router.push('/login')

        })
        //失敗した場合はcatchを使って取得する
        .catch((error) => {
            console.log("fail", error)

            //エラーメッセージを表示
            this.errorMessage = "ユーザーの新規作成に失敗しました"

        })
    }
  },
}
</script>

<style scoped>
/* scoped... 現在のコンポーネントの要素にのみ適用される */
.login-form {
    margin: 150px;
    padding: 30px;
}
.login-box {
    /* width: 50%; */
    margin: 0px auto;
    padding: 30px;
}
.login-title {
    display: inline-block;
}
.login-btn {
    margin-right: 20px;
}
.error-message {
    margin-top: 20px;
}
</style>