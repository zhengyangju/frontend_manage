<template>
    <el-button plain :disabled="false" type="primary" @click="downloadCelebrities()">
        {{ $t('celebrities.download') }}
    </el-button>
</template>
<script lang="ts" setup>
import { downloadCelebrityFiles } from '@/api/modules/celebrity';

const downloadCelebrities = () => {
    downloadCelebrityFiles()
        .then((res) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([res]));
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = downloadUrl;
            a.download = '网红模版';
            const event = new MouseEvent('click');
            a.dispatchEvent(event);
        })
        .finally(() => {});
};
</script>
