<template>
    <div>
      <h1>People You Can Ride With!</h1>
      <ul>
        <li
          v-for="user in users"
          :key="user.userID"
          @click="selectUser(user.userID)"
        >
          {{ user.username }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import socket from "@/socket";
  
  export default {
    data() {
      return {
        users: [],
      };
    },
    
    created() {

      // Fetch the list of users from the server
      socket.on("users", (users) => {
        this.users = users;
      });
  

    },
    //new

    methods: {
      selectUser(userId) {
        console.log("selectUser");
        // Navigate to the Messages Page for the selected user
        socket.emit("get users");

        // this.$router.push({ path: `/chat/${userId}` });
        //forces a reload
        this.$router.push({ path: `/chat/${userId}` }).then(() => {
          this.$router.go();
    });
      },
    },
  };
  </script>
  
  <style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  li {
    padding: 10px;
    cursor: pointer;
    border: 1px solid #ccc;
    margin-bottom: 5px;
  }
  
  li:hover {
    background-color: #f0f0f0;
  }
  </style>