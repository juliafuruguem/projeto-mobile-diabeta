import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container1: {
      flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
  },  
  content: {
    flex: 1,
    width: '100%',
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  titulo: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(16, 47, 80, 0.8)',
    marginTop: 30,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: 'rgba(16, 47, 80, 0.8)',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: 320,
    borderBottomColor: 'rgba(62, 100, 129, 0.32)',
    borderBottomWidth: 1,
    fontSize: 18,
    color: 'rgba(16, 47, 80, 0.88)',
    marginBottom: 25,
  },
  botao: {
    backgroundColor: '#094f88',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 17,
    alignItems: 'center',
    width: 320,
    marginBottom: 40,
  },
  botaoCadastrar: {
    backgroundColor: '#094f88',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  textoUsuarioEncontrado: {
    marginTop: 10,
    fontSize: 16,
    color: 'green',
    textAlign: 'center',
  },
  cadastroContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
});
