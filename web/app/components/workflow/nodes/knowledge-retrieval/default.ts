import type { NodeDefault, Var } from '../../types'
import { getNotExistVariablesByArray } from '../../utils/workflow'
import type { KnowledgeRetrievalNodeType } from './types'
import { checkoutRerankModelConfigedInRetrievalSettings } from './utils'
import { DATASET_DEFAULT } from '@/config'
import { RETRIEVE_TYPE } from '@/types/app'
import { genNodeMetaData } from '@/app/components/workflow/utils'
import { BlockEnum } from '@/app/components/workflow/types'
const i18nPrefix = 'workflow'

const metaData = genNodeMetaData({
  sort: 2,
  type: BlockEnum.KnowledgeRetrieval,
})
const nodeDefault: NodeDefault<KnowledgeRetrievalNodeType> = {
  metaData,
  defaultValue: {
    query_variable_selector: [],
    dataset_ids: [],
    retrieval_mode: RETRIEVE_TYPE.multiWay,
    multiple_retrieval_config: {
      top_k: DATASET_DEFAULT.top_k,
      score_threshold: undefined,
      reranking_enable: false,
    },
  },
  checkValid(payload: KnowledgeRetrievalNodeType, t: any) {
    let errorMessages = ''
    if (!errorMessages && (!payload.query_variable_selector || payload.query_variable_selector.length === 0))
      errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.knowledgeRetrieval.queryVariable`) })

    if (!errorMessages && (!payload.dataset_ids || payload.dataset_ids.length === 0))
      errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.nodes.knowledgeRetrieval.knowledge`) })

    if (!errorMessages && payload.retrieval_mode === RETRIEVE_TYPE.oneWay && !payload.single_retrieval_config?.model?.provider)
      errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t('common.modelProvider.systemReasoningModel.key') })

    const { _datasets, multiple_retrieval_config, retrieval_mode } = payload
    if (retrieval_mode === RETRIEVE_TYPE.multiWay) {
      const checked = checkoutRerankModelConfigedInRetrievalSettings(_datasets || [], multiple_retrieval_config)

      if (!errorMessages && !checked)
        errorMessages = t(`${i18nPrefix}.errorMsg.fieldRequired`, { field: t(`${i18nPrefix}.errorMsg.fields.rerankModel`) })
    }

    return {
      isValid: !errorMessages,
      errorMessage: errorMessages,
    }
  },
  checkVarValid(payload: KnowledgeRetrievalNodeType, varMap: Record<string, Var>, t: any) {
    const errorMessageArr = []

    const query_variable_selector_warnings = getNotExistVariablesByArray([payload.query_variable_selector], varMap)
    if (query_variable_selector_warnings.length)
      errorMessageArr.push(`${t('workflow.nodes.knowledgeRetrieval.queryVariable')} ${t('workflow.common.referenceVar')}${query_variable_selector_warnings.join('、')}${t('workflow.common.noExist')}`)

    return {
      isValid: true,
      warning_vars: [...query_variable_selector_warnings],
      errorMessage: errorMessageArr,
    }
  },
}

export default nodeDefault
