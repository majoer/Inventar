<template>
  <div class="in">
    <div>
      <p>Scan denne koden først, deretter scanner du varene :)</p>
    </div>

    <div><i class="fa fa-5x fa-barcode"/></div>

    <div>
      <button v-on:click="$router.push('/')">
        <i class="fa fa-4x fa-times-circle"/>
        <div>Avbryt</div>
      </button>
      <button v-on:click="$router.push('/inn/les-inn')">
        <i class="fa fa-4x fa-arrow-circle-right"/>
        <div>Neste</div>
      </button>
    </div>
  </div>
</template>

<script>
export default {
};
</script>

<style lang="scss">
.in {
  text-align: center;
}
</style>
