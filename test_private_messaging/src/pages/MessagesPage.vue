<template>
    <div>
      <div class="left-panel">
        <user
          v-for="user in users"
          :key="user.userID"
          :user="user"
          :selected="selectedUser && selectedUser.userID === user.userID"
          @select="onSelectUser(user)"
        />
      </div>
      <div class="right-panel">
        <div v-if="selectedUser">
            <h1>Chat with {{ selectedUser.username }}</h1>
          <message-panel
            :user="selectedUser"
            @input="onMessage"
          />
        </div>
        <div v-else>
          <h1>Select a user to start chatting</h1>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import socket from "@/socket";
  import User from "@/components/User.vue";
  import MessagePanel from "@/components/MessagePanel.vue";
  
  export default {
    name: "MessagesPage",
    components: { User, MessagePanel },
    props: {
      userId: String, // The user ID is passed as a route param
    },
    data() {
        console.log("data");
      return {
        selectedUser: null,
        users: [],
      };
    },
    methods: {
      onMessage(content) {
        if (this.selectedUser) {
          // Send the message to the selected user
          socket.emit("private message", {
            content,
            to: this.selectedUser.userID,
          });
  
          // Add the message to the local message history
          this.selectedUser.messages.push({
            content,
            fromSelf: true,
          });
        }
      },
      onSelectUser(user) {
        if (this.selectedUser && this.selectedUser.userID === user.userID) {
            console.log("Already on the chat page for this user, no navigation needed.");
            return; // Prevent unnecessary navigation
        }
        console.log("onSelectUser");
        this.selectedUser = user;
        user.hasNewMessages = false;
  

        // Update the URL to reflect the selected user
        console.log("this.$router", this.$router);
        this.$router.push({ path: `/chat/${user.userID}` });
      },
    },
    watch: {
      // Watch for changes in the route param (userId)
      userId: {
        immediate: true,
        handler(newUserId) {
          if (newUserId) {
            // Find the selected user from the list of users
            this.selectedUser = this.users.find((user) => user.userID === newUserId);
            if (this.selectedUser) {
              this.selectedUser.hasNewMessages = false;
            }
          } else {
            this.selectedUser = null;
          }
        },
      },
    },
    created() {
        console.log("created");
      // Handle socket events
      socket.on("connect", () => {
        this.users.forEach((user) => {
          if (user.self) {
            user.connected = true;
          }
        });
      });
  
      socket.on("disconnect", () => {
        this.users.forEach((user) => {
          if (user.self) {
            user.connected = false;
          }
        });
      });
  
      const initReactiveProperties = (user) => {
        user.hasNewMessages = false;
      };
  
      socket.on("users", (users) => {
        users.forEach((user) => {
          user.messages.forEach((message) => {
            message.fromSelf = message.from === socket.userID;
          });
          for (let i = 0; i < this.users.length; i++) {
            const existingUser = this.users[i];
            if (existingUser.userID === user.userID) {
              existingUser.connected = user.connected;
              existingUser.messages = user.messages;
              return;
            }
          }
          user.self = user.userID === socket.userID;
          initReactiveProperties(user);
          this.users.push(user);
        });
  
        // Sort users: current user first, then alphabetically by username
        this.users.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });
  
        // If a user ID is provided in the route, set the selected user
        if (this.userId) {
          this.selectedUser = this.users.find((user) => user.userID === this.userId);
        }
      });
  
      socket.on("user connected", (user) => {
        for (let i = 0; i < this.users.length; i++) {
          const existingUser = this.users[i];
          if (existingUser.userID === user.userID) {
            existingUser.connected = true;
            return;
          }
        }
        initReactiveProperties(user);
        this.users.push(user);
      });
  
      socket.on("user disconnected", (id) => {
        for (let i = 0; i < this.users.length; i++) {
          const user = this.users[i];
          if (user.userID === id) {
            user.connected = false;
            break;
          }
        }
      });
  
      socket.on("private message", ({ content, from, to }) => {
        for (let i = 0; i < this.users.length; i++) {
          const user = this.users[i];
          const fromSelf = socket.userID === from;
          if (user.userID === (fromSelf ? to : from)) {
            user.messages.push({
              content,
              fromSelf,
            });
            if (user !== this.selectedUser) {
              user.hasNewMessages = true;
            }
            break;
          }
        }
      });
  
      // Request the list of users from the server
      socket.emit("get users");
    },
    destroyed() {
      // Clean up socket listeners
      socket.off("connect");
      socket.off("disconnect");
      socket.off("users");
      socket.off("user connected");
      socket.off("user disconnected");
      socket.off("private message");
    },
  };
  </script>
  
  <style scoped>
  .left-panel {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: 260px;
    overflow-x: hidden;
    background-color: #3f0e40;
    color: white;
  }
  
  .right-panel {
    margin-left: 260px;
    padding: 20px;
  }
  </style>