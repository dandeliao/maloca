<template>
  <main v-if="pagina" v-html="pagina"></main>
</template>

<script>
export default {
  async asyncData(context) {
    const nome = context.params.pessoa
    const pessoa = await fetch(`http://localhost:4000/api/pessoas/${nome}`)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else if(res.status === 404) {
        return Promise.reject(new Error('Erro 404: não encontrado'));
      } else {
        return Promise.reject(new Error('Erro: ' + res.status));
      }
    })
    console.log('pessoa', pessoa)
    const pagina = pessoa.html
    return {
      pagina,
    }
  },
}
</script>

