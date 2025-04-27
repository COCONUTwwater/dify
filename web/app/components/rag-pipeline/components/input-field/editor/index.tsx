import { RiCloseLine } from '@remixicon/react'
import DialogWrapper from '../dialog-wrapper'
import type { InputVar } from '@/app/components/workflow/types'
import InputFieldForm from './form'
import { convertToInputFieldFormData } from './utils'

type InputFieldEditorProps = {
  show: boolean
  onClose: () => void
  initialData?: InputVar
}

const InputFieldEditor = ({
  show,
  onClose,
  initialData,
}: InputFieldEditorProps) => {
  const formData = convertToInputFieldFormData(initialData)

  return (
    <DialogWrapper
      show={show}
      onClose={onClose}
      panelWrapperClassName='pr-[424px] justify-start'
      className='w-[400px] grow-0 rounded-2xl border-[0.5px] bg-components-panel-bg shadow-shadow-shadow-9'
    >
      <div className='relative flex h-fit flex-col'>
        <div className='system-xl-semibold flex items-center pb-1 pl-4 pr-11 pt-3.5 text-text-primary'>
          Add Input Field
        </div>
        <button
          type='button'
          className='absolute right-2.5 top-2.5 flex size-8 items-center justify-center'
          onClick={onClose}
        >
          <RiCloseLine className='size-4 text-text-tertiary' />
        </button>
        <InputFieldForm
          initialData={formData}
          supportFile
          onCancel={onClose}
          onSubmit={(value) => {
            console.log('submit', value)
            onClose()
          }}
        />
      </div>
    </DialogWrapper>
  )
}

export default InputFieldEditor
