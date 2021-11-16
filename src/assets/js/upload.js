function createHelper(tag,classes = [],content = ''){
   const node = document.createElement(tag)
   if(classes.length){
      node.classList.add(...classes)
   }
   if(content){
      node.textContent = content
   }
   return node
}
function noop(){}
export function Upload(selector,options = {}){
   const onUpload = options.onUpload ?? noop
   let files = []
   const preview = createHelper('div',['preview'])
   const open = createHelper('button',['btn'],'Открыть')
   const upload = createHelper('button',['btn','upload'],'Загрузить')
   const input = document.getElementById(selector)
   upload.style.display = 'none'
   input.classList.add('upload')
   if(options.multi){
      input.setAttribute('multiple',options.multi)
   }
   if(options.accept && Array.isArray(options.accept)){
      input.setAttribute('accept',options.accept.join(','))
   }

   // insert into HTML
   input.insertAdjacentElement('afterend',preview)
   input.insertAdjacentElement('afterend',upload)
   input.insertAdjacentElement('afterend',open)

   // listeners
   const triggerOpen = () => input.click()
   const changeHandler = e =>{
      files = Array.from(e.target.files)
      if(!files.length){
         return
      }
      upload.style.display = 'inline'
      files.forEach(file => {
         preview.innerHTML = ''
         if (!file.type.match('image')) {
            return
         }
         const reader = new FileReader()
         reader.onload = e => {
            const src = e.target.result
            preview.insertAdjacentHTML('afterbegin',
               `
               <div class='preview__img'>
               <span class='preview__delete' data-name='${file.name}'>&times;</span>
               <img src='${src}' alt='${file.name}'>
               <div class='preview__info'>
               <span>${file.name}</span>
               <span>${Math.round(file.size / 1000)}КБ</span>
               </div>
               </div>
               `
            )
         }
         reader.readAsDataURL(file)
      })

   }
   const removeHandler = e =>{
      const {name} = e.target.dataset
      const target = e.target
      if(!name){
         return
      }
      files = files.filter(i => i.name !== name )
      if(!files.length){
         upload.style.display = 'none'
      }
      const block = target.closest('.preview__img')
      block.classList.add('removed')
      setTimeout(() => block.remove(),400)
   }
   const clearPreview = el => {
      el.style.opacity = '1'
      el.innerHTML = "<div class='preview__info-progress'></div>"
   }
   const uploadHandler = e =>{
      document.querySelectorAll('.preview__delete').forEach(i => i.remove())
      const infoBlock = document.querySelectorAll('.preview__info')
      infoBlock.forEach(clearPreview)
      onUpload(files,infoBlock)
   }
   // events
   open.addEventListener('click',triggerOpen)
   input.addEventListener('change',changeHandler)
   preview.addEventListener('click',removeHandler)
   upload.addEventListener('click',uploadHandler)
}