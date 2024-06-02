<template>
  <div class="container">
    <form @submit.prevent="save" class="form">
      <input type="text" v-model="form.title" placeholder="Judul" class="input" /><br />
      <textarea v-model="form.content" placeholder="Isi" class="textarea"></textarea><br />
      <button type="submit" class="button">Simpan</button>
    </form>
    <ul class="article-list">
      <li v-for="article in articles" :key="article.id" class="article-item">
        <h3>{{ article.title }}</h3>
        <p>{{ article.content }}</p>
        <button @click="edit(article)" class="button">Edit</button>
        <button @click="remove(article.id)" class="button">Hapus</button>
      </li>
    </ul>
    <button @click="load" class="button load-button">Muat</button>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const form = reactive({
      id: null,
      title: '',
      content: ''
    });

    const articles = ref([]);

    async function load() {
      try {
        const response = await axios.get('http://localhost:3000/articles');
        articles.value = response.data;
      } catch (error) {
        console.error('Error memuat artikel:', error);
      }
    }

    async function save() {
      try {
        const url = form.id ? `http://localhost:3000/articles/${form.id}` : 'http://localhost:3000/articles';
        const method = form.id ? 'put' : 'post';
        const response = await axios[method](url, form);

        if (method === 'put') {
          const index = articles.value.findIndex(article => article.id === response.data.id);
          if (index !== -1) {
            articles.value[index] = response.data;
          }
        } else {
          articles.value.push(response.data);
        }

        form.id = null;
        form.title = '';
        form.content = '';
      } catch (error) {
        console.error('Error menyimpan artikel:', error);
      }
    }

    async function remove(id) {
      try {
        await axios.delete(`http://localhost:3000/articles/${id}`);
        articles.value = articles.value.filter(article => article.id !== id);
      } catch (error) {
        console.error('Error menghapus artikel:', error);
      }
    }

    function edit(article) {
      form.id = article.id;
      form.title = article.title;
      form.content = article.content;
    }

    onMounted(load);

    return { form, articles, save, edit, remove, load };
  }
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form {
  margin-bottom: 20px;
}

.input, .textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.button {
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  background-color: #008cff;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.button:hover {
  background-color: #0056b3;
}

.article-list {
  list-style-type: none;
  padding: 0;
}

.article-item {
  background-color: white;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}

.article-item h3 {
  margin: 0 0 10px;
}

.article-item p {
  margin: 0 0 10px;
}

.load-button {
  display: block;
  margin: 20px auto 0;
}
</style>
