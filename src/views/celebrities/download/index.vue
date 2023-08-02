<template>
    <el-button plain :disabled="false" type="primary" @click="downloadCelebrities()">
        {{ $t('celebrities.download') }}
    </el-button>
</template>
<script lang="ts" setup>
import { downloadCelebrityFiles } from '@/api/modules/celebrity';

const downloadCelebrities = () => {
    downloadCelebrityFiles();
};
</script>
