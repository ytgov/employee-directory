const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;

const divisionsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'divisions.json'), 'utf8'));
const employeesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'employees.json'), 'utf8'));

function matches(value, filter) {
  return typeof value === 'string' && value.toLowerCase() === filter.toLowerCase();
}

function filterDivisions(query) {
  let results = divisionsData.divisions;
  if (query.department) {
    results = results.filter((d) => matches(d.department, query.department));
  }
  return results;
}

function filterEmployees(query) {
  let results = employeesData.employees;
  if (query.department) {
    results = results.filter((e) => matches(e.department, query.department));
  }
  if (query.division) {
    results = results.filter((e) => matches(e.division, query.division));
  }
  if (query.keyword) {
    const normalize = (value) => value.toLowerCase().replace(/\./g, ' ');
    const keyword = normalize(query.keyword);
    results = results.filter((e) => [e.full_name, e.first_name, e.last_name, e.email]
      .some((field) => typeof field === 'string' && normalize(field).includes(keyword)));
  }
  return results;
}

const server = http.createServer((req, res) => {
  const { pathname, searchParams } = new URL(req.url, 'http://localhost');
  const query = Object.fromEntries(searchParams);

  let body;
  if (pathname === '/divisions') {
    const divisions = filterDivisions(query);
    body = { count: divisions.length, divisions };
  } else if (pathname === '/employees') {
    const employees = filterEmployees(query);
    body = { count: employees.length, employees };
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'not found' }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
});

server.listen(PORT, () => {
  console.log(`Mock data API listening on port ${PORT}`);
});
