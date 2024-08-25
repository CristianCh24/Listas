const express = require('express');
const bodyParser = require('body-parser');
const { Octokit } = require('@octokit/rest');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const owner = 'CristianCh24';  // Cambia esto por tu nombre de usuario de GitHub
const repo = 'Lista';         // Cambia esto por el nombre de tu repositorio

// Ruta para guardar los datos
app.post('/save', async (req, res) => {
    const { filePath, content } = req.body;

    try {
        // Obtener el SHA del archivo si ya existe para actualizarlo
        let sha = null;
        try {
            const { data: { sha: existingSha } } = await octokit.repos.getContent({
                owner,
                repo,
                path: filePath
            });
            sha = existingSha;
        } catch (error) {
            // El archivo no existe, lo crearemos
        }

        // Crear o actualizar el archivo en el repositorio
        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: `Actualizar archivo ${filePath}`,
            content: Buffer.from(content).toString('base64'),
            sha: sha
        });

        res.status(200).send('Archivo guardado exitosamente en GitHub.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al guardar el archivo en GitHub.');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

