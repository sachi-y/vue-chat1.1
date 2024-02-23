<template>
        <v-navigation-drawer
        v-model="drawer"
        app
      >
        <v-sheet
          color="grey lighten-4"
          class="pa-4"
        >
        <v-avatar color="indigo">

          <!-- ref ...自分が保存しているファイルを参照できる -->
          <input type="file"
          ref="fileInput"
          accept="=image/jpeg, image/jpg, image/png"
          style="display: none;"
          @change="updateIcon">

          <v-icon dark
          v-if="!photoUrl"
          @click="changeIcon">
            mdi-account-circle
          </v-icon>

          <img :src="photoUrl"
          alt=""
          @click="changeIcon"
          v-if="photoUrl">

        </v-avatar>
          <!-- &&...ifとして機能。もし、authがあれば -->
          <div class="username">{{ auth && auth.displayName }}</div>
        </v-sheet>
  
        <v-divider></v-divider>
  
        <v-list>
          <v-list-item
            v-for="[icon, text, to] in links"
            :key="icon"
            :to="to"
            link
          >
            <v-list-item-icon>
              <v-icon>{{ icon }}</v-icon>
            </v-list-item-icon>
  
            <v-list-item-content>
              <v-list-item-title>{{ text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>

          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>
                mdi-logout
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
</template>

<script>
import firebase from "../../firebase/firebase"

export default {
  //mounted...htmlが描画された後に、処理が動く
    mounted() {
      //ログイン時に、セッション内にデータがあれば、保存する処理
      this.auth = JSON.parse(sessionStorage.getItem('user'))
      this.photoUrl = this.auth.photoURL
    },
    data: () => ({
    drawer: null,
    links: [
        ['mdi-inbox-arrow-down', 'Inbox',"/"],
        ['mdi-send', 'Send',"/about"],
        ['mdi-delete', 'Trash',"/about"],
        ['mdi-alert-octagon', 'Spam',"/about"],
    ],
    auth: null,
    photoUrl: "",
    }),
    methods: {
      logout() {
        console.log("logout call")
        firebase.auth().signOut()
        .then(() => {
          localStorage.message = "ログアウトに成功しました"
          this.$router.push('/login')
        })
        .catch((error) => {
        console.log("fail", error)
        })
      },
      changeIcon() {
        // console.log("changeIcon call")
        //$refsのref属性(fileInput)を取得し、クリックすることで画像参照できる
        this.$refs.fileInput.click()
      },
      updateIcon() {
        console.log("updateIcon call")
        const user = this.getAuth()
        //ログイン状況を確認し、ログインが正常に行われていなければログイン画面に戻る処理をつける
        if(!user){
          sessionStorage.removeItem('user')
          this.$router.push('/login')
        }

        //filesというプロパティで選択したファイル情報(fileInput)を取得できる
        const file = this.$refs.fileInput.files[0]
        //ファイル保存先の指定...${file.name)}で画像名 ==>こうすると変更した画像が随時保存されてしまうため、あえて関数を拒否file.name→現在使用中のものだけがfirebaseのストレージに保存される！
        const filePath = `/user/file.name`
        console.log(file)

        firebase.storage().ref() //ファイアベースのストレージメソッドを使用してインスタンスを取得
          .child(filePath) //childメソッドでパスを指定
          .put(file) //putメソッドでファイルをアップロード
          .then(async snapshot => { //アップロードが成功したら
            // console.log("snapshot",snapshot)

            //ダウンロードしたファイルのURLを取得
            //await ...取得できるまで処理を待つ
            const photoUrl = await snapshot.ref.getDownloadURL()
            console.log("photoUrl", photoUrl)

            //ファイアベース上にphotoUrlというプロパティを作り、photoUrlの情報を更新
            firebase.auth().onAuthStateChanged((user) =>{
              if(user) {
                user.updateProfile({
                  photoURL: photoUrl
                })
                //auth,sessionの中にあるphotoURL
                this.auth.photoURL = photoUrl
                sessionStorage.setItem('user',JSON.stringify(this.auth))

                this.photoUrl = photoUrl

              }
            })
          });
      },
      //アイコン変更前に、ファイアベースでユーザー情報を取得
      getAuth() {
        //onAuthStateChangedを取得しファイアベースのユーザー情報を取得
        //returnをreturnすることで返り値をgetAuthの返り値として取得
        return firebase.auth().onAuthStateChanged((user) =>{
          return user
        })
      }
    }
}
</script>