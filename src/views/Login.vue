<template>
    <!-- vuetifyはv-appで囲まないと、cssが反映されないのでつけとく。 -->
    <v-app>
        <div class="login-box">
            <v-card class="login-form">
                <v-card-title class="login-title">Login</v-card-title>
                <v-card-subtitle>ユーザー情報をご入力ください</v-card-subtitle>
                <v-btn text color="light-blue" to="signup">新規登録はこちら</v-btn>
                <v-form
                    ref="form"
                    v-model="valid"
                    lazy-validation
                    >
                    <!-- :コロンがあると変数扱い(jsとして評価される)、なしは文字列扱いに注意 -->
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
                        LOGIN
                    </v-btn>
                    <v-btn>
                        CLEAR
                    </v-btn>

                    <!-- ログイン成功メッセージ -->
                    <v-alert
                      dense
                      text
                      type="success"
                      class="success-message"
                      v-if="message"
                    >
                    <!-- v-ifでもしメッセージがあった場合に表示させる -->
                    {{ message }}
                    </v-alert>

                    <!-- ログイン失敗メッセージ -->
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
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    email: '',
    // vuetifyによるテンプレート↓
    emailRules: [
      v => !!v || 'メールアドレスを入力してくだい',
      v => /.+@.+\..+/.test(v) || 'メールアドレスが不正です',
    ],
    password:'',
    message:'',
    errorMessage:'',
  }),
  //新規登録が成功してlocalStorageにメッセージが格納されたかどうかをlogin画面が表示された時点で取得しにいき、メッセージがあれば表示する
  //mounted ...dom(HTML)が表示された後に、実行される
  mounted() {
    if(localStorage.message) {
      // this.message =data{}内のメッセージに代入する
      this.message = localStorage.message;
      // リロードした場合は、空文字にする
      localStorage.message = '';
    }
  },
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
      firebase.auth()
      .signInWithEmailAndPassword(this.email, this.password)
      .then((result) => {
        console.log("success")
        console.log("user", result.user)

        //ログインしたユーザー情報を動的に管理(サイドバーに表示する機能などを装着)
        //セッション...ブラウザ内に保存されるデータ一時保存場所（ローカルストレージ...無期限の保存場所）
        const auth = {
          displayName: result.user.displayName,
          email: result.user.email,
          uid: result.user.uid,
          refreshToken: result.user.refreshToken,
          photoURL: result.user.photoURL
        }

        //セッションストレージ...オブジェクトの取得は、string型(文字列)が必須
        sessionStorage.setItem('user',JSON.stringify(auth))

        //TOPにリダイレクト
        this.$router.push('/')

      })
      .catch((error) => {
        console.log("fail", error)
        this.errorMessage = "ログインに失敗しました"
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
.success-message {
  margin-top: 20px;
}
.error-message {
    margin-top: 20px;
}
</style>