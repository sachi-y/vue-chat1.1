<template>
    <v-app id="inspire">
      <Sidebar />
      <v-main>
        <!-- 3項条件分岐 もしroomがあれば表示し、なければ空にする-->
        <h1>{{ room? room.name:"" }}</h1>
        <v-container
          class="py-8 px-6"
          fluid
        >
          <v-row>
            <v-col
              v-for="card in cards"
              :key="card"
              cols="12"
            >
              <v-card>
                <v-subheader>{{ card }}</v-subheader>
  
                <v-list two-line>
                  <template v-for="(data,index)  in messages">
                    <v-list-item

                      :key="index"
                    >
                      <v-list-item-avatar color="grey darken-1">
                        <v-img :src="data.photoURL"></v-img>
                      </v-list-item-avatar>
  
                      <v-list-item-content>
                        <!-- <v-list-item-title>Message {{ n }}</v-list-item-title> -->
  
                        <v-list-item-subtitle class="message">
                            {{ data.message }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
  
                    <v-divider
                      v-if="index !== 6"
                      :key="`divider-${index}`"
                      inset
                    ></v-divider>
                  </template>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <v-textarea
          v-model="body"
          append-icon="mdi-comment"
          class="mx-2"
          label="メッセージを送信する"
          rows="3"
          auto-grow
        ></v-textarea>
        <v-btn
      class="me-4"
      type="submit"
      :disabled="invalid"
      @click="submit"
    >
      submit
    </v-btn>
    <v-btn @click="clear">
      clear
    </v-btn>
      </v-main>
    </v-app>
  </template>
  <script>
import firebase from "../firebase/firebase"
import Sidebar from '../components/layouts/Sidebar'

    export default {
      components: {
        Sidebar
      },
        //画面が表示されたタイミングで処理を実行する
        // jsの書き方 awaitを記述する上で必要
        async created() {
            // console.log("created call");
            this.roomId = this.$route.query.room_id;
            console.log("room_id", this.room_id);

            // 参照先を定義
            const roomRef = firebase.firestore().collection("rooms").doc(this.roomId)
            // 参照先からドキュメント(=roomId)を取得
            const roomDoc = await roomRef.get()
            // 参照先にドキュメントがない場合は、ログイン画面へ戻る
            if(!roomDoc.exists) {
              await this.$router.push('/')
            }
            this.room = roomDoc.data()
            console.log("room",this.room,"roomDoc",roomDoc)

            //firebase内のmessagesを取得 作成日時順にソート(orderBy)
            // const snapshot = await roomRef.collection('messages').orderBy("createdAt","asc").get()
            // snapshot.forEach(doc => {
            //   console.log(doc.data())
            //   this.messages.push(doc.data())
            // })




            // const chatRef = firebase.firestore().collection("chats");
            // console.log("chatRef",chatRef);
            // // await...get()の処理でデータが返ってくるまで、一旦処理を止める
            // const snapshot = await chatRef.get();
            // console.log("snapshot",snapshot);

            // snapshot.forEach(doc => {
            //   console.log(doc.data())
            //   this.messages.push(doc.data())
            // })
        },
      mounted(){
        // ログイン情報の取得
        this.auth = JSON.parse(sessionStorage.getItem('user'))
        console.log(this.auth)

        //リアルタイムでデータベースアップデートを入手する
        const roomRef = firebase.firestore().collection('rooms').doc(this.roomId);
        roomRef.collection('messages').orderBy("createdAt","asc")
        //onSnapshot 変更を検知
        .onSnapshot(snapshot => {
          //docChanges リアルタイムで変更
          snapshot.docChanges().forEach(change => {
            console.log('new message', change.doc.data())
            this.messages.push(change.doc.data())
          })
        })

      },
      data: () => ({
        messages: [
            // {message: "message 1"},
            // {message: "message 2"},
            // {message: "message 3"},
            // {message: "message 4"},
            // {message: "message 5"},
        ],
        // テキストエリアの中を定義
        body: '',
        room_id:'',
        room: null,
        // cards: ['Today', 'Yesterday'],
        cards: ['Today'],
        drawer: null,
        links: [
          ['mdi-inbox-arrow-down', 'Inbox'],
          ['mdi-send', 'Send'],
          ['mdi-delete', 'Trash'],
          ['mdi-alert-octagon', 'Spam'],
        ],
        auth: null,
        // invalid: false
      }),
      computed: {
        // コンピュータ内で定義した関数は、コンピュータ内で使用している値が変化されれば実行される仕組み
        invalid() {
        // 変更が検知されたら実行する
            if(!this.body) {
                return true;
            }
            return false;
        }
      },
      methods: {
        clear() {
            console.log("clear call")
            this.body = "";
        },
        submit() {
            console.log("submit call", this.body)
            //データの最初に追加(unshift)
            // this.messages.push({
            //   message: this.body,
            //   name: this.auth.displayName,
            //   photoURL: this.auth.photoURL,
            //   createdAt: firebase.firestore.Timestamp.now()
            // });
            // this.body = "";

            // firebase内に入力したメッセージを追加
            const roomRef = firebase.firestore().collection('rooms').doc(this.roomId)
            roomRef.collection('messages').add({
              message: this.body,
              name: this.auth.displayName,
              photoURL: this.auth.photoURL,
              createdAt: firebase.firestore.Timestamp.now()
            })
            .then(result => {
              console.log("succes",result)
              this.body = "";
            })
            .catch(error => {
              console.log("fail",error)
              alert('メッセージの送信に失敗しました')
            })
        }
      }
    }
  </script>

  <style scoped>
  .message {
    text-align: left;
  }
</style>