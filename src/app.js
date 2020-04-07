const express = require("express");
const cors = require("cors");
const { uuid } = require('uuidv4');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const repositoryLink = (req, res, next) => {
  req.url = 'https://github.com/Rocketseat/umbriel'
  next();
}

app.get("/repositories", (request, response) => {

  return response.status(200).json(repositories);

});

app.post("/repositories", repositoryLink, (request, response) => {
  
  const { title, techs } = request.body;
  const { url } = request;

  const repo = {id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repo)

  return response.status(200).json(repo);

});

app.put("/repositories/:id", (request, response) => {
  
  const { id } = request.params;
  const { title, techs, url } = request.body  

  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({error: "Repository not found."})
  }

  repositories[repoIndex].title = title;
  repositories[repoIndex].url = url;
  repositories[repoIndex].techs = techs;

  return response.status(200).json(repositories[repoIndex]);
});

app.delete("/repositories/:id", (req, res) => {
  
  const { id } = req.params;
  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if (repoIndex < 0) {
    return res.status(400).json({error: "Repository not found."})
  }

  repositories.splice(repoIndex, 1);

  return res.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repository => repository.id == id);

  if (repoIndex < 0) {
    return response.status(400).json({error: "Repository not found."})
  }
  
  repositories[repoIndex].likes++;

  return response.json(repositories[repoIndex]);

});

module.exports = app;
