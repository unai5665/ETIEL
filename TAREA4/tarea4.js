
// ----------------------- CLASES BÁSICAS ----------------------- //

class BaseNode {
  constructor(name, type){
    this.name = name;
    this.type = type;
    this.id = NodeIdGenerator.nextId();
    this.parent = null;
  }
}

// Nodo que representa una carpeta (puede contener hijos)
class DirectoryNode extends BaseNode {
  constructor(name){
    super(name, 'folder');
    this.children = [];
  }

  // Añade un hijo, si no existe otro con el mismo nombre y tipo
  addChild(node){
    const exists = this.children.some(
      c => c.name.toLowerCase() === node.name.toLowerCase() && c.type === node.type
    );
    if(exists) return false;
    node.parent = this;
    this.children.push(node);
    return true;
  }

  // Elimina un hijo por su ID
  removeChildById(childId){
    const idx = this.children.findIndex(c => c.id === childId);
    if(idx === -1) return false;
    this.children.splice(idx,1);
    return true;
  }

  // Devuelve true si no tiene hijos
  isEmpty(){
    return this.children.length === 0;
  }
}

// Nodo que representa un archivo (sin hijos)
class FileNode extends BaseNode {
  constructor(name){
    super(name, 'file');
  }
}

// Generador de IDs únicos para los nodos
const NodeIdGenerator = {
  _id: 1,
  nextId(){ return this._id++; }
};

// ----------------------- ESTADO INICIAL ----------------------- //

const root = new DirectoryNode('/'); // Carpeta raíz

// ----------------------- SELECTORES ----------------------- //

const treeContainer = document.querySelector('#treeContainer');
const controlForm = document.querySelector('#controlForm');
const nameInput = document.querySelector('#nameInput');
const typeSelect = document.querySelector('#typeSelect');
const filterInput = document.querySelector('#filterInput');
const filterForm = document.querySelector('#filterForm');

// ----------------------- RENDERIZADO ----------------------- //

// Crea los elementos HTML para representar un nodo
function createNodeElement(node){
  const li = document.createElement('li');
  li.classList.add('node', node.type);
  li.setAttribute('data-id', node.id);

  // Botón de eliminar
  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'icon deleteBtn';
  deleteBtn.setAttribute('title','Eliminar');
  deleteBtn.textContent = 'X';
  deleteBtn.addEventListener('click', onDeleteClick);

  // Checkbox para expandir/contraer carpetas
  if(node.type === 'folder'){
    const toggleCheckbox = document.createElement('input');
    toggleCheckbox.type = 'checkbox';
    toggleCheckbox.className = 'checkboxToggle';
    toggleCheckbox.checked = true;
    toggleCheckbox.addEventListener('change', onToggleChange);
    li.appendChild(deleteBtn);
    li.appendChild(toggleCheckbox);
  } else {
    li.appendChild(deleteBtn);
  }

  // Nombre del nodo
  const nameSpan = document.createElement('span');
  nameSpan.className = 'nameLabel';
  nameSpan.textContent = node.name;
  nameSpan.setAttribute('title', node.name);

  // Controles (botón de añadir dentro de carpeta)
  const controls = document.createElement('div');
  controls.className = 'controls';

  if(node.type === 'folder'){
    const addBtn = document.createElement('button');
    addBtn.className = 'icon addBtn';
    addBtn.setAttribute('title','Agregar archivo o subcarpeta aquí');
    addBtn.textContent = '+';
    addBtn.addEventListener('click', onAddClick);
    controls.appendChild(addBtn);
  }

  li.appendChild(nameSpan);
  li.appendChild(controls);

  // Si es una carpeta, crea una lista interna para los hijos
  if(node.type === 'folder'){
    const ul = document.createElement('ul');
    ul.className = 'dirList';
    ul.setAttribute('data-parent-id', node.id);
    li.appendChild(ul);
  }

  return li;
}

// Renderiza todo el árbol a partir de la raíz
function renderTree(){
  treeContainer.innerHTML = '';
  const rootUl = document.createElement('ul');
  rootUl.className = 'dirList';
  const rootLi = createNodeElement(root);

  // Quita el botón eliminar de la raíz
  const firstBtn = rootLi.querySelector('button.deleteBtn');
  if(firstBtn) firstBtn.remove();

  rootLi.querySelector('.nameLabel').textContent = '/';

  // Renderiza hijos de la raíz
  const childUl = rootLi.querySelector('ul.dirList');
  root.children.forEach(child => {
    const childLi = createNodeElement(child);
    childUl.appendChild(childLi);
    if(child.type === 'folder') renderChildrenRecursive(child, childLi);
  });

  rootUl.appendChild(rootLi);
  treeContainer.appendChild(rootUl);
}

// Renderiza los hijos de forma recursiva
function renderChildrenRecursive(dirNode, liElement){
  const ul = liElement.querySelector('ul.dirList');
  ul.innerHTML = '';
  dirNode.children.forEach(child => {
    const childLi = createNodeElement(child);
    ul.appendChild(childLi);
    if(child.type === 'folder') renderChildrenRecursive(child, childLi);
  });
}

// ----------------------- OPERACIONES ----------------------- //

// Busca un nodo por ID
function findNodeById(id, current=root){
  if(current.id === id) return current;
  if(current.type === 'folder'){
    for(const child of current.children){
      const res = findNodeById(id, child);
      if(res) return res;
    }
  }
  return null;
}

// Busca el padre de un nodo
function findParentOf(id, current=root){
  if(current.type !== 'folder') return null;
  for(const child of current.children){
    if(child.id === id) return current;
    if(child.type === 'folder'){
      const res = findParentOf(id, child);
      if(res) return res;
    }
  }
  return null;
}

// Añade un nodo (archivo o carpeta) dentro de un directorio
function addNodeIntoDirectory(dirNode, name, type){
  const nodeName = name.trim();
  if(!nodeName) return {ok:false, msg:'Nombre vacío'};

  // 🚫 Validación de caracteres no permitidos
  const invalidChars = /[,@'"\?\*\>\<\\\/]/; // puedes agregar más si quieres
  if(invalidChars.test(nodeName)){
    return {ok:false, msg:'El nombre contiene caracteres no permitidos (, @ \' " ? * < > / \\).'};
  }

  const newNode = (type === 'folder') ? new DirectoryNode(nodeName) : new FileNode(nodeName);
  const added = dirNode.addChild(newNode);
  if(!added) return {ok:false, msg:`Ya existe un ${type} con ese nombre en la carpeta.`};
  return {ok:true, node:newNode};
}

// Elimina un nodo si es posible
function deleteNodeById(nodeId){
  if(nodeId === root.id) return {ok:false, msg:'No se puede borrar la carpeta raíz.'};
  const parent = findParentOf(nodeId);
  if(!parent) return {ok:false, msg:'Elemento no encontrado.'};
  const node = parent.children.find(c => c.id === nodeId);
  if(!node) return {ok:false, msg:'Elemento no encontrado.'};
  if(node.type === 'folder' && !node.isEmpty()) return {ok:false, msg:'No se puede borrar una carpeta que no esté vacía.'};
  const removed = parent.removeChildById(nodeId);
  return removed ? {ok:true} : {ok:false, msg:'No se pudo eliminar.'};
}

// ----------------------- HANDLERS ----------------------- //

// Crear nodo en la raíz
controlForm.addEventListener('submit', function(evt){
  evt.preventDefault();
  const name = nameInput.value.trim();
  const type = typeSelect.value;
  if(!name){ alert('Introduce un nombre válido.'); return; }

  const res = addNodeIntoDirectory(root, name, type);
  if(!res.ok){ alert(res.msg); return; }

  nameInput.value = '';
  renderTree();
  applyFilter();
});

// Eliminar nodo
function onDeleteClick(evt){
  evt.stopPropagation();
  const li = evt.target.closest('li.node');
  const nodeId = Number(li.getAttribute('data-id'));
  if(!confirm('¿Eliminar este elemento?')) return;
  const res = deleteNodeById(nodeId);
  if(!res.ok){ alert(res.msg); return; }
  renderTree();
  applyFilter();
}

// Añadir dentro de carpeta
function onAddClick(evt){
  evt.stopPropagation();
  const li = evt.target.closest('li.node');
  const dirId = Number(li.getAttribute('data-id'));
  const dirNode = findNodeById(dirId);
  if(!dirNode || dirNode.type !== 'folder') return;

  const name = nameInput.value.trim() || prompt('Nombre del nuevo archivo o carpeta:');
  if(!name) return;

  const inferredType = name.includes('.') ? 'file' : 'folder';
  const res = addNodeIntoDirectory(dirNode, name, inferredType);
  if(!res.ok){ alert(res.msg); return; }

  nameInput.value = '';
  renderTree();
  applyFilter();
}

// Expandir / contraer carpetas
function onToggleChange(evt){
  evt.stopPropagation();
  const checkbox = evt.target;
  const li = checkbox.closest('li.node');
  const ul = li.querySelector('ul.dirList');
  if(!ul) return;
  ul.style.display = checkbox.checked ? '' : 'none';
}

// ----------------------- FILTRO DE BÚSQUEDA ----------------------- //

filterInput.addEventListener('input', applyFilter);

// Autocompletar con TAB
filterInput.addEventListener('keydown', function(evt){
  if(evt.key === 'Tab'){
    evt.preventDefault();
    const current = filterInput.value;
    if(!current) return;
    const matches = collectAllNames().filter(n => n.toLowerCase().startsWith(current.toLowerCase()));
    if(matches.length === 1){
      filterInput.value = matches[0];
      applyFilter();
    }
  }
});

// Evita recargar al presionar Enter en el buscador
filterForm.addEventListener('submit', function(evt){
  evt.preventDefault();
  applyFilter();
});

// Autocompletar para el campo de creación
nameInput.addEventListener('keydown', function(evt){
  if(evt.key === 'Tab'){
    evt.preventDefault();
    const current = nameInput.value;
    if(!current) return;
    const matches = collectAllNames().filter(n => n.toLowerCase().startsWith(current.toLowerCase()));
    if(matches.length === 1){ nameInput.value = matches[0]; }
  }
});

// Recolecta todos los nombres de nodos (para autocompletado)
function collectAllNames(){
  const results = [];
  function dfs(node){
    if(node !== root) results.push(node.name);
    if(node.type === 'folder') node.children.forEach(child => dfs(child));
  }
  dfs(root);
  return results;
}

// ----------------------- APLICAR FILTRO ----------------------- //

function applyFilter(){
  const q = filterInput.value.trim().toLowerCase();
  renderTree();

  if(!q) return;

  const allLis = treeContainer.querySelectorAll('li.node');

  // Oculta todo excepto raíz
  allLis.forEach(li => {
    if(Number(li.getAttribute('data-id')) !== root.id)
      li.classList.add('hidden');
  });

  // Muestra solo los que coincidan
  allLis.forEach(li => {
    const name = li.querySelector('.nameLabel')?.textContent || '';
    if(name.toLowerCase().includes(q)){
      let cur = li;
      while(cur && cur !== treeContainer){
        cur.classList.remove('hidden');
        const ul = cur.querySelector('ul.dirList');
        if(ul) ul.style.display = '';
        cur = cur.parentElement;
        if(cur && cur.tagName === 'UL') cur = cur.closest('li.node');
      }
    }
  });
}

// ----------------------- INICIALIZACIÓN ----------------------- //

renderTree();

// Atajo: Shift + clic en nombre para crear dentro
document.addEventListener('click', function(evt){
  if(evt.target.classList.contains('nameLabel')){
    if(evt.shiftKey){
      const li = evt.target.closest('li.node');
      const id = Number(li.getAttribute('data-id'));
      const node = findNodeById(id);
      if(node && node.type === 'folder'){
        const name = prompt('Crear dentro de ' + node.name + ' — nombre:');
        if(!name) return;
        const inferredType = name.includes('.') ? 'file' : 'folder';
        const res = addNodeIntoDirectory(node, name, inferredType);
        if(!res.ok) alert(res.msg);
        renderTree();
        applyFilter();
      }
    }
  }
});
