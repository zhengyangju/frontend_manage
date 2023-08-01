<template>
    <div>
        <el-drawer v-model="backupVisiable" :destroy-on-close="true" :close-on-click-modal="false" size="100%">
            <template #header>
                <DrawerHeader
                    v-if="detailName"
                    :header="$t('commons.button.view')"
                    :resource="name + '(' + detailName + ')'"
                    :back="handleClose"
                />
                <DrawerHeader v-else :header="$t('celebrities.detail')" :resource="name" :back="handleClose" />
            </template>
            <ComplexTable v-loading="loading" v-model:selects="selects" :data="data">
                <template #toolbar>
                    <el-button type="primary" @click="onCelebritySave()">
                        {{ $t('commons.button.save') }}
                    </el-button>
                </template>
                <el-table-column :label="$t('celebrities.character')" prop="character">
                    <template #default="{ row }">
                        <fu-select-rw-switch v-model="row.character">
                            <template #read>
                                <el-tag disable-transitions>
                                    {{ characters.find((item) => item.value === row.character).label }}
                                </el-tag>
                            </template>
                            <el-option
                                v-for="item in characters"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value"
                            />
                        </fu-select-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('commons.table.name')" prop="name">
                    <template #default="{ row }">
                        <fu-input-rw-switch v-model="row.name"></fu-input-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('celebrities.headshot')" prop="headshot">
                    <template #default="{ row }">
                        <el-avatar :size="50" :src="row.headshot" @click="openUploads(row)" />
                    </template>
                </el-table-column>
                <el-table-column :label="$t('celebrities.sex')" prop="sex">
                    <template #default="{ row }">
                        <fu-select-rw-switch v-model="row.sex">
                            <template #read>
                                <el-tag disable-transitions>
                                    {{ sexTypes.find((item) => item.value === row.sex).label }}
                                </el-tag>
                            </template>
                            <el-option
                                v-for="item in sexTypes"
                                :key="item.key"
                                :label="item.label"
                                :value="item.value"
                            />
                        </fu-select-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('celebrities.address')" prop="address">
                    <template #default="{ row }">
                        <fu-input-rw-switch v-model="row.address"></fu-input-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('celebrities.ballot')" prop="ballot" />
                <el-table-column :label="$t('celebrities.remark')" prop="remark" show-overflow-tooltip>
                    <template #default="{ row }">
                        <fu-input-rw-switch v-model="row.remark"></fu-input-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('rank.contact_information')"
                    prop="contact_information"
                    show-overflow-tooltip
                >
                    <template #default="{ row }">
                        <fu-input-rw-switch v-model="row.contact_information"></fu-input-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('rank.tik_tok_link')" prop="tik_tok_link" show-overflow-tooltip>
                    <template #default="{ row }">
                        <fu-input-rw-switch v-model="row.tik_tok_link"></fu-input-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    :label="$t('rank.little_red_book_link')"
                    prop="little_red_book_link"
                    show-overflow-tooltip
                >
                    <template #default="{ row }">
                        <fu-input-rw-switch v-model="row.little_red_book_link"></fu-input-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('rank.bilibili_link')" prop="bilibili_link" show-overflow-tooltip>
                    <template #default="{ row }">
                        <fu-input-rw-switch v-model="row.bilibili_link"></fu-input-rw-switch>
                    </template>
                </el-table-column>
                <el-table-column :label="$t('rank.weibolntl_link')" prop="weibolntl_link" show-overflow-tooltip>
                    <template #default="{ row }">
                        <fu-input-rw-switch v-model="row.weibolntl_link"></fu-input-rw-switch>
                    </template>
                </el-table-column>
            </ComplexTable>
        </el-drawer>
    </div>
    <Uploads ref="uploadRef" :upload-func="UploadImageFileData" @call-back="setUrl" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { getCelebrityDetail } from '@/api/modules/celebrity';
import DrawerHeader from '@/components/drawer-header/index.vue';
import i18n from '@/lang';
import { editCelebrityDetail } from '@/api/modules/celebrity';
import Uploads from '@/views/celebrities/upload/index.vue';
import { UploadImageFileData } from '@/api/modules/images';
import { MsgSuccess } from '@/utils/message';

const emit = defineEmits(['search']);

const selects = ref<any>([]);
const loading = ref();

const data = ref();

const backupVisiable = ref(false);
const name = ref();
const detailName = ref();
const uploadRef = ref();

const characters = ref();
const sexTypes = ref();

characters.value = [
    {
        label: i18n.global.t('celebrities.entertainment'),
        value: 1,
        key: 'entertainment',
    },
    {
        label: i18n.global.t('celebrities.lifeCategory'),
        value: 2,
        key: 'lifeCategory',
    },
    {
        label: i18n.global.t('celebrities.gameCategory'),
        value: 3,
        key: 'gameCategory',
    },
    {
        label: i18n.global.t('celebrities.knowledgeCategory'),
        value: 4,
        key: 'knowledgeCategory',
    },
];

sexTypes.value = [
    {
        label: i18n.global.t('celebrities.sex_man'),
        value: 1,
        key: 'sex_man',
    },
    {
        label: i18n.global.t('celebrities.sex_woman'),
        value: 2,
        key: 'sex_woman',
    },
];

const acceptParams = (row): void => {
    backupVisiable.value = true;
    getDetail(row);
};
const handleClose = () => {
    backupVisiable.value = false;
};

const onCelebritySave = () => {
    editCelebrityDetail(data.value[0]).then(() => {
        MsgSuccess('保存成功！');
        handleClose();
        emit('search');
    });
};

const getDetail = (row) => {
    getCelebrityDetail({ id: row.id }).then((res) => {
        data.value = [res.data];
    });
};

const openUploads = (row) => {
    uploadRef.value.acceptParams(row);
};

const setUrl = (row) => {
    console.log(row);
};

defineExpose({
    acceptParams,
});
</script>
