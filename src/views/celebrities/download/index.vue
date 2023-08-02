<template>
    <el-button plain :disabled="false" type="primary" @click="downloadCelebrities()">
        {{ $t('celebrities.download') }}
    </el-button>
</template>
<script lang="ts" setup>
const downloadFile = (filePath: string) => {
    let url = `${import.meta.env.VITE_API_URL as string}/celebrities/template?`;
    window.open(url + 'path=' + filePath, '_blank');
};

const downloadCelebrities = () => {
    downloadFile('');
};
</script>
