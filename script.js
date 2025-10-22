const form = document.querySelector('form');
const botaoAdicionar=document.getElementById('botao');
    const inputNome=document.querySelector('input[type="text"]');
    const inputValor =document.querySelector('input[type="number"]');
    const lista=document.getElementById('lista');
    const elPendente=document.getElementById('pendente');
    const elConcluido=document.getElementById('concluido');

    let tarefas =JSON.parse(localStorage.getItem('tarefas')) ||[];

    function salvarTarefas(){
        localStorage.setItem('tarefas', JSON.stringify(tarefas));
    }

    function formatarReal(valor){
        return `R$ ${valor.toFixed(2)}`;
    }

    function renderizar(){
        lista.innerHTML="";

        let totalPendente=0;
        let totalConcluido=0;

        tarefas.forEach(t=>{
            const li = document.createElement('li');
            li.className="item";

            const info=document.createElement("div");
            info.className="info";
            info.innerHTML=`<span class="nome">${t.nome}</span> <span class="valor"> ${formatarReal(t.valor)}</span>`;


            const botoes=document.createElement('div');
            botoes.className="botoes";

            const btnConcluir = document.createElement('button');
            btnConcluir.textContent=t.concluido ? 'Desfazer' : 'Concluir';
            btnConcluir.className=t.concluido ? 'desfazer' : 'concluir';

            const btnExcluir=document.createElement('button');
            btnExcluir.textContent="Excluir";
            btnExcluir.classList='excluir';

            btnConcluir.addEventListener('click', ()=>{
                t.concluido=!t.concluido;
                salvarTarefas();
                renderizar();
            });

            btnExcluir.addEventListener('click', ()=>{
                tarefas=tarefas.filter(item=> item.id !== t.id);
                salvarTarefas();
                renderizar();
            });

            botoes.appendChild(btnConcluir);
            botoes.appendChild(btnExcluir);
            li.appendChild(info)
            li.appendChild(botoes);

            if(t.concluido){
                li.style.opacity='0.6'
                li.style.textDecoration='line-through';
                totalConcluido+=t.valor;
            }else{
                totalPendente+=t.valor;
            }

            lista.appendChild(li);
        })

        elPendente.textContent=formatarReal(totalPendente);
        elConcluido.textContent=formatarReal(totalConcluido);
    }

    function adicionarTarefa(e){

        

        const nome=inputNome.value.trim();
        const valor=parseFloat(inputValor.value);

        if(!nome){
            alert('Digite o nome da tarefa.');
            return;
        }
        if(isNaN(valor) ||valor<=0){
            alert('Digite um valor válido (maior que 0).');
            return;
        }

        const tarefa={
            id:Date.now(),
            nome,
            valor,
            concluido:false
        };

        tarefas.push(tarefa);
        salvarTarefas();
        renderizar();

        inputNome.value='';
        inputValor.value='';
        inputNome.focus();
    };

        botaoAdicionar.addEventListener('click', adicionarTarefa);


        [inputNome, inputValor].forEach(inp =>{
            inp.addEventListener('keyup', (e) =>{
                if (e.key==='Enter') {
                    e.preventDefault();
                adicionarTarefa(e);
                }
            });
        });
        form.addEventListener('submit', e => e.preventDefault());

        renderizar();
   