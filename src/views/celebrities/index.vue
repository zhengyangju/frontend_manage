<template>
    <div>
        <el-card class="router_card">
            <el-radio-group v-model="character" @change="handleChangeChacter">
                <el-radio-button
                    class="router_card_button"
                    :label="item.id"
                    v-for="(item, id) in characteres.list"
                    size="large"
                    :key="id"
                >
                    {{ item.name }}
                </el-radio-button>
            </el-radio-group>
        </el-card>
        <LayoutContent v-loading="loading" :title="characterName">
            <template #toolbar>
                <el-row>
                    <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16">
                        <el-button plain :disabled="false" type="primary" @click="openUploads()">
                            {{ $t('celebrities.import') }}
                        </el-button>
                        <Download />
                        <el-button plain :disabled="false" type="primary" @click="openAvatarUpload()">
                            {{ $t('celebrities.upload_avatart') }}
                        </el-button>
                    </el-col>
                    <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8">
                        <div class="search-button">
                            <el-input
                                v-model="searchName"
                                clearable
                                @clear="search()"
                                suffix-icon="Search"
                                @keyup.enter="search()"
                                @change="search()"
                                :placeholder="$t('commons.button.search')"
                            ></el-input>
                        </div>
                    </el-col>
                </el-row>
            </template>
            <template #main>
                <ComplexTable :pagination-config="paginationConfig" :data="data" @search="search" @sort-change="search">
                    <el-table-column :label="$t('celebrities.headshot')" prop="headshot" fix>
                        <template #default="{ row }">
                            <span v-if="row.headshot">
                                <el-avatar shape="circle" :size="50" :src="row.headshot" />
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('celebrities.name')" prop="name" sortable>
                        <template #default="{ row }">
                            <span v-if="row.name">
                                {{ row.name }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('celebrities.address')" prop="address" sortable>
                        <template #default="{ row }">
                            <span v-if="row.address">
                                {{ row.address }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('celebrities.sex')" prop="sex" sortable>
                        <template #default="{ row }">
                            <span v-if="row.sex">
                                {{ row.sex === 1 ? $t('celebrities.sex_man') : $t('celebrities.sex_woman') }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('celebrities.ballot')" prop="ballot">
                        <template #default="{ row }">
                            <span v-if="row.ballot">
                                {{ row.ballot }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        :label="$t('celebrities.remark')"
                        prop="remark"
                        show-overflow-tooltip
                    ></el-table-column>
                    <el-table-column ellipsis="4" :label="$t('commons.table.operate')" width="230">
                        <template #default="{ row }">
                            <el-button
                                v-for="item in buttons"
                                :key="item.key"
                                :type="item.type(row)"
                                link
                                @click="item.click(row)"
                            >
                                {{ typeof item.label === 'function' ? item.label(row) : item.label }}
                            </el-button>
                        </template>
                    </el-table-column>
                </ComplexTable>
            </template>
        </LayoutContent>
        <CelebritiesDetail
            ref="dialogBackupRef"
            @search="search"
            :is-edit="true"
            :list="characteres.list"
        ></CelebritiesDetail>
        <Uploads
            ref="uploadRef"
            :character="character"
            :upload-func="uploadCelebrityFiles"
            @call-back="updateCelebrity"
        />
        <Delete ref="deleteRef" @call-back="search()"></Delete>
        <MultipleUpload ref="multipleUploadRef" :upload-func="uploadMultipleAvatarFiles" @call-back="updateCelebrity" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import {
    getCelebrityPage,
    setCelebrityFollow,
    setCelebrityLike,
    getCelebrityCharacterPage,
} from '@/api/modules/celebrity';
import CelebritiesDetail from '@/components/celebrities-detail/index.vue';
import Uploads from './upload/index.vue';
import Download from './download/index.vue';
import MultipleUpload from './upload/multiple.vue';
import i18n from '@/lang';
import { uploadCelebrityFiles, uploadMultipleAvatarFiles } from '@/api/modules/celebrity';
import Delete from './delete/index.vue';
import { MsgSuccess } from '@/utils/message';
// import { GlobalStore } from '@/store';

// const globalStore = GlobalStore();

const paginationConfig = reactive({
    currentPage: 1,
    pageSize: 50,
    total: 0,
});
const character = ref();
const characterName = ref('');

const characteres = reactive({
    list: [],
});

const data = ref();

const uploadRef = ref();

const loading = ref(false);

const searchName = ref();

const dialogBackupRef = ref();

const deleteRef = ref();

const multipleUploadRef = ref();

const onOpenBackupDialog = async (row) => {
    dialogBackupRef.value!.acceptParams(row);
};

const buttons = [
    {
        label: (row) =>
            row.is_followed ? i18n.global.t('celebrities.is_followed') : i18n.global.t('celebrities.is_follow'),
        click: (row) => {
            setCelebrityFollow({ id: row.id, is_followed: !row.is_followed });
            MsgSuccess(i18n.global.t('celebrities.set_follow'));
            search();
        },
        type: (row) => (row.is_followed ? 'danger' : 'primary'),
        key: 1,
    },
    {
        label: (row) => (row.is_liked ? i18n.global.t('celebrities.is_liked') : i18n.global.t('celebrities.is_like')),
        click: (row) => {
            setCelebrityLike({ id: row.id, is_liked: !row.is_liked });
            MsgSuccess(i18n.global.t('celebrities.set_follow'));
            search();
        },
        type: (row) => (row.is_liked ? 'danger' : 'primary'),
        key: 2,
    },
    {
        label: i18n.global.t('commons.button.delete'),
        click: (row) => {
            deleteRef.value.acceptParams(row);
        },
        type: () => 'primary',
        key: 3,
    },
    {
        label: i18n.global.t('celebrities.detail'),
        click: (row) => {
            onOpenBackupDialog(row);
        },
        type: () => 'primary',
        key: 4,
    },
];

const search = async (column?: any) => {
    let params = {
        character: character.value,
        page: paginationConfig.currentPage,
        size: paginationConfig.pageSize,
        orderBy: column?.order ? column.prop : 'created_at',
        order: column?.order ? column.order : 'null',
        searchName: searchName.value,
    };
    loading.value = true;
    await getCelebrityPage(params)
        .then((res) => {
            loading.value = false;
            data.value = res.data.data || [];
            paginationConfig.total = res.data.total;
        })
        .catch(() => {
            loading.value = false;
        });
};

const initCelebrityCharacter = () => {
    getCelebrityCharacterPage({
        is_page: false,
        page: 0,
        size: 0,
    }).then((res) => {
        // console.log(res.data);
        characteres.list = res.data.data;
        character.value = res.data.data[0].id;
        let item = characteres.list.find((item) => item.id === character.value);
        if (item) {
            characterName.value = item.name;
        }
    });
};

const handleChangeChacter = () => {
    let item = characteres.list.find((item) => item.id === character.value);
    if (item) {
        characterName.value = item.name;
    }
    paginationConfig.currentPage = 1;
    search();
};

const openUploads = () => {
    uploadRef.value.acceptParams();
};

const openAvatarUpload = () => {
    multipleUploadRef.value.acceptParams();
};

const updateCelebrity = () => {
    search();
};

onMounted(() => {
    initCelebrityCharacter();
    search();
});
</script>

<style lang="scss">
.header {
    padding-bottom: 10px;
}

.app-card {
    margin-top: 10px;
    cursor: pointer;
    padding: 5px;

    .top-header {
        padding: 10px 20px 10px 20px;
        border-radius: var(--el-card-border-radius); //6px;
        color: #fff;
        .app-title {
            font-weight: 500;
            font-size: 16px;
            // color: var(--el-text-color-regular);
        }
    }

    .app-content {
        margin-top: 10px;
        height: 100%;
        width: 100%;

        .app-header {
            height: 20%;

            .app-title {
                font-weight: 500;
                font-size: 16px;
                color: var(--el-text-color-regular);
            }

            .app-button {
                float: right;
                margin-right: 20px;
            }
        }

        .app-desc {
            margin-top: 5px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;

            text-overflow: ellipsis;
            height: 45px;

            .desc {
                font-size: 14px;
                color: var(--el-text-color-regular);
            }
        }

        .app-tag {
            margin-top: 5px;
        }
    }

    .e-card {
        border: var(--panel-border) !important;

        &:hover {
            cursor: pointer;
            border: 1px solid var(--el-color-primary) !important;
        }
    }
}

.tag-button {
    margin-right: 10px;

    &.no-active {
        background: none;
        border: none;
    }
}

@media only screen and (min-width: 768px) and (max-width: 1200px) {
    .app-col-12 {
        max-width: 50%;
        flex: 0 0 50%;
    }
}

.page-button {
    float: right;
    margin-bottom: 10px;
    margin-top: 10px;
}
</style>
