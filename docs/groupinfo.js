const W3C_APIURL = "https://api.w3.org/";

let DATA_CACHE = {};
function getW3CData(queryPath) {
  const apiURL = new URL(queryPath, W3C_APIURL);
  apiURL.searchParams.set("apikey", "esj1ar4rl3scks04kg8kkwo4kwc8ow4");
  apiURL.searchParams.set("embed", "1"); // grab everything
  apiURL.searchParams.set("limit", "200"); // default is 100 otherwise
  const ENTRY = apiURL.toString();
  if (DATA_CACHE[ENTRY]) return DATA_CACHE[ENTRY];
  return DATA_CACHE[ENTRY] = fetch(apiURL).then(r => r.json()).then(data => {
    if (data.pages && data.pages > 1)
     console.error(`${queryPath} needs pagination support`); // @@TODO
    return data._embedded? data._embedded : data;
  });
}

async function groupInfo(groupId) {
  const group = await getW3CData(`/groups/${groupId}`);
//  console.log(group);
  const {
    _links: {
      specifications: { href: specsHref },
    },
  } = group;

  for (const key in group._links) {
    if (group._links.hasOwnProperty(key)) {
      const href = group._links[key].href;
      if (key === "self") {
        // skip
      } else if (href.indexOf(W3C_APIURL) === 0) {
        group[key] = getW3CData(href).then(data => (data[key])? data[key] : data);
      } else {
        group[key] = href;
      }
    }
  }
  // Some additional useful links
  group["details"] = `https://www.w3.org/2000/09/dbwg/details?group=${groupId}&order=org&public=1`;
  group["edit"] = `https://www.w3.org/2011/04/dbwg/group-services?gid=${groupId}`;
  return group;
}

// firs rec track, then note, then alphabetical order
function sortRepo(a, b) {
  let recA = a.hasRecTrack;
  let recB = b.hasRecTrack;
  if (recA && !recB) {
    return -1;
  }
  if (!recA && recB) {
    return 1;
  }
  let noteA = a.hasNote;
  let noteB = b.hasNote;
  if (noteA && !noteB) {
    return -1;
  }
  if (!noteA && noteB) {
    return 1;
  }
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }

  // names must be equal
  return 0;
}

async function groupRepos(groupId) {

  const report = "https://w3c.github.io/validate-repos/report.json";

  return fetch(report).then(r => r.json()).then(data => {
    let repos = data.groups[groupId].repos.map(repo => {
      let GH = data.repos.filter(r => (r.name === repo.name && r.owner.login === repo.fullName.split('/')[0]))[0];
      GH.fullName = repo.fullName;
      GH.hasRecTrack = GH.w3c["repo-type"].includes("rec-track");
      GH.hasNote = GH.w3c["repo-type"].includes("note");
      return GH;
    });
    repos.sort(sortRepo);
    return repos;
  });
}
