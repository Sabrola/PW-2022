import React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import api from '../lib/api'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import ConfirmDialog from '../ui/ConfirmDialog'
import Notification from '../ui/notification'


export default function ClientList() {

  const columns = [
    { 
      field: 'id',        // Campo nos dados retornados pela API
      headerName: 'Cód.',
      type: 'integer',     // Coluna fica alinhada à direita
      width: 60 
    },
    {
      field: 'nome',
      headerName: 'Nome',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 220
    },
    {
      field: 'cpf',
      headerName: 'CPF',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 130
    },
    {
      field: 'rg',
      headerName: 'RG',
      type: 'number',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 150
    },
    {
      field: 'data_nascimento',
      headerName: 'Data de Nascimento',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 110
    },
    {
      field: 'logradouro',
      headerName: 'Logradouro',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 110
    },
    {
      field: 'num_imovel',
      headerName: 'Num do Imóvel',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 110
    },
    {
      field: 'complemento',
      headerName: 'Complemento',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 110
    },
    {
      field: 'bairro',
      headerName: 'Bairro',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 110
    },
    {
      field: 'municipio',
      headerName: 'Municipio/UF',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 200,
      // Concatenando as informações de marca e modelo numa mesma coluna
      valueGetter: params => params.row?.municipio + ' ' + params.row?.uf
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      type: 'number',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 110,
    },
    {
      field: 'email',
      headerName: 'E-Mail',
      headerAlign: 'center',    // Alinhamento do cabeçalho
      align: 'center',          // Alinhamento da célula de dados
      width: 300,
    },
    {
      field: 'editar',
      headerName: 'Editar',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params =>  (
        <IconButton aria-label='Editar'>
          <EditIcon />
        </IconButton>
      )
    },
    {
      field: 'excluir',
      headerName: 'Excluir',
      headerAlign: 'center',
      align: 'center',
      width: 90,
      renderCell: params =>  (
        <IconButton aria-label='Excluir' onClick={() => handleDeleteClick(params.id)}>
          <DeleteForeverIcon color="error" />
        </IconButton>
      )
    },

  ];

  const [state, setState] = React.useState({
    clientes: [],       // Vetor vazio,
    deleteId: null,     // id do registro a ser excluído
    dialogOpen: false,  // se o diálogo de confirmação está aberto ou não,
    notifSeverity: '',  // Severidade da notificação
    notifMessage: ''    // Mensagem de notificação
  })
  const { clientes, deleteId, dialogOpen, notifSeverity, notifMessage } = state

  function handleDeleteClick(id) {
    setState({
      ...state,
      deleteId: id,
      dialogOpen: true
    })  
  }

  // useEffect() com vetor de dependências vazio para ser executado
  // apenas uma vez no momento da montagem do componente
  React.useEffect(() => {
    // Buscar os dados da API remota
    fetchData()
  }, [])

  async function fetchData(newState = state) {
    try {
      const response = await api.get('clientes')
      // Armazenar o response em um variável de estado
      setState({...newState, clientes: response.data})
    }
    catch (error) {
      setState({
        ...newState,
        notifSeverity: 'error',
        notifMessage: 'ERRO: ' + error.message
      })
    }
  }

  async function handleDialogClose(answer) {
    let newState = {...state, dialogOpen: false}
    if(answer) {
      try {
        await api.delete(`clientes/${deleteId}`)
        newState = {
          ...newState,
          notifSeverity: 'success',
          notifMessage: 'Item excluído com sucesso.'
        }
        // Recarrega os dados da grid
        fetchData(newState)
      }
      catch(error) {
        setState({
          ...newState,
          notifSeverity: 'error',
          notifMessage: 'ERRO: não foi possível excluir o item.\nMotivo: ' + error.message
        })
      }
    }
    else setState(newState)
  }

  function handleNotifClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }

    setState({...state, notifMessage: ''})  // Fecha a notificação
  }

  return (
    <>
      <h1>Listagem de Clientes</h1>
      
      <ConfirmDialog
        title="Confirmação necessária"
        open={dialogOpen}
        onClose={handleDialogClose}
      >
        Deseja realmente excluir este item?
      </ConfirmDialog>

      <Notification 
        severity={notifSeverity}
        message={notifMessage}
        open={notifMessage}
        duration={5000}
        onClose={handleNotifClose}
      />

      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          sx={{
            // Esconde os botões de editar excluir na visualização normal
            '& .MuiDataGrid-row button': {
              visibility: 'hidden'
            },
            // Retorna a visibilidade dos botões quando o mouse estiver
            // sobre a linha da grid
            '& .MuiDataGrid-row:hover button': {
              visibility: 'visible'
            }
          }}
          rows={clientes}
          columns={[
            { field: 'nome', hideable: false },
            { field: 'cpf', hideable: false },
            { field: 'municipio', hideable: false },
            { field: 'uf', hideable: false },
            { field: 'telefone', hideable: false },
            { field: 'email', hideable: false },
          ]}
          pageSize={10}
          rowsPerPageOptions={[5]}
          autoHeight
          disableSelectionOnClick
        />
      </Box>
    </>
  )
}
