<template>
    <section class="flex flex-col gap-[10px]">
        <div class="flex items-center gap-[8px]">
            <PhCalendarBlank :size="22" class="fill-principal" />
            <Texto as="h4" color="principal">
                Próximas defesas
            </Texto>
        </div>
        <Texto as="body" color="gray" v-if="defesas.length === 0">
            Nenhuma defesa agendada no momento.
        </Texto>
        <div
            v-for="(defesa, index) in defesas"
            :key="index"
            class="flex flex-col gap-[4px] border-b border-secundaria-opaco pb-[10px] last:border-b-0"
        >
            <Texto as="body-bold">
                {{ defesa.tema || 'Tema não informado' }}
            </Texto>
            <Texto as="small" color="gray">
                {{ defesa.aluno?.nome }} {{ defesa.aluno?.sobrenome }} — orientador(a) {{ defesa.professor?.nome }} {{ defesa.professor?.sobrenome }}
            </Texto>
            <div class="flex items-center gap-[4px]">
                <PhClock :size="16" class="fill-gray-600" />
                <Texto as="small" color="gray">
                    {{ formatMask.viewDate (defesa.dataDefesa) }} às {{ defesa.horaDefesa }}
                </Texto>
            </div>
            <Texto as="small" color="gray" v-if="defesa.banca?.length">
                Banca examinadora: {{ defesa.banca.map((membro) => membro.instituicao ? `${membro.nome} (${membro.instituicao})` : membro.nome).join(', ') }}
            </Texto>
            <div class="flex items-center gap-[4px]" v-if="defesa.presencial && defesa.local">
                <PhMapPin :size="16" class="fill-gray-600" />
                <Texto as="small" color="gray">
                    {{ defesa.local }}
                </Texto>
            </div>
            <div class="flex items-center gap-[4px]" v-else-if="defesa.link">
                <PhVideoCamera :size="16" class="fill-gray-600" />
                <a :href="defesa.link" target="_blank" class="text-[10px] font-bold uppercase text-gray-600 hover:underline">
                    Acessar defesa online
                </a>
            </div>
            <button
                v-else-if="!defesa.presencial"
                type="button"
                :class="[
                    'cursor-pointer w-fit flex items-center gap-[6px] mt-[4px] px-[10px] py-[6px] rounded-md font-bold text-[11px] uppercase',
                    defesa.chamadaAoVivo?.ativa ? 'bg-red-600 hover:bg-red-700 text-white' : 'border border-principal text-principal hover:bg-secundaria',
                ]"
                @click="entrarAoVivo(defesa)"
            >
                <span v-if="defesa.chamadaAoVivo?.ativa" class="w-[8px] h-[8px] rounded-full bg-white animate-pulse"></span>
                <PhVideoCamera v-else :size="14" />
                {{ defesa.chamadaAoVivo?.ativa ? 'Ao vivo — entrar na defesa' : 'Acessar defesa online' }}
            </button>
        </div>
    </section>
</template>

<script setup>
import { PhCalendarBlank, PhClock, PhMapPin, PhVideoCamera } from '@phosphor-icons/vue';
import { onMounted, ref } from "vue";
import Texto from '@components/Texto.vue';
import api from "@/api.js";
import { formatMask, popupInfo } from '@/stores/util.js';

const defesas = ref ([]);

async function start () {
    await api.get ('/orientacao/publicas')
        .then ((res) => {
            defesas.value = res.data.item;
        })
        .catch ((e) => {
            console.log (e);
        });
}

async function entrarAoVivo (defesa) {
    await api.post (`/orientacao/${defesa._id}/videochamada/token/publico`)
        .then ((res) => {
            const { token, roomName, appId } = res.data;
            window.open (`https://8x8.vc/${appId}/${roomName}?jwt=${token}#config.startWithAudioMuted=true`, '_blank');
        })
        .catch ((e) => {
            popupInfo ().warning (e?.response?.data?.msg || 'Erro ao entrar na defesa ao vivo.');
        });
}

onMounted (start);
</script>
