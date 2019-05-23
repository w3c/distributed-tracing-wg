// used by getW3CData and groupInfo
const W3C_APIURL = "https://api.w3.org/";

// Fetch any JSON data and cache it
let DATA_CACHE = {};
function getData(url) {
  const ENTRY = url.toString();
  if (DATA_CACHE[ENTRY]) return DATA_CACHE[ENTRY];
  return DATA_CACHE[ENTRY] = fetch(url).then(r => r.json());
}

// Fetch any JSON data from W3C API and cache it
function getW3CData(queryPath) {
  const apiURL = new URL(queryPath, W3C_APIURL);
  apiURL.searchParams.set("apikey", "esj1ar4rl3scks04kg8kkwo4kwc8ow4");
  apiURL.searchParams.set("embed", "1"); // grab everything
  return getData(apiURL).then(data => {
    if (data.pages && data.pages > 1)
     console.error(`${queryPath} needs pagination support`); // @@TODO
    if (data._embedded) return data._embedded; // assume withLinks is already covered
    return data;
  });
}
// W3C API follows a HAL model. This function creates promises to resolve the links
// going deeper into the API.
function resolveW3CLinks(set) {
  function iter(data) {
    if (data._links) {
      Object.entries(data._links).forEach(e => {
        const key = e[0];
        const href = e[1].href;
        if (key === "self") {
          // skip
        } else if (href.indexOf(W3C_APIURL) === 0) {
          data[key] = getW3CData(href).then(subdata => (subdata[key])? subdata[key] : subdata);
        } else {
          data[key] = href;
        }
      });
    }
  }
  if (Array.isArray(set))
   set.map(iter);
  else
   iter(set);
  return set;
}

// the main function. Just retrieve everything...
async function groupInfo(groupId) {
  const group = await getW3CData(`/groups/${groupId}`, true).then(resolveW3CLinks);
  // dive deeper into specifications
  group["specifications"] = group["specifications"].then(resolveW3CLinks);
  // simplify participations a bit
  group["participations"] = group["participations"].then(data => {data.forEach(p => {
          p.title = p._links[(p.individual)? "user": "organization"].title;
    }); return data.sort(sortParticipants);});

    // Some additional useful links
  group["details"] = `https://www.w3.org/2000/09/dbwg/details?group=${groupId}&order=org&public=1`;
  group["edit"] = `https://www.w3.org/2011/04/dbwg/group-services?gid=${groupId}`;

  group["dashboard"] = {
    href: `https://w3c.github.io/spec-dashboard/?${groupId}`,
    repositories: getData(`https://w3c.github.io/spec-dashboard/pergroup/${groupId}-repo.json`),
    milestones: getData(`https://w3c.github.io/spec-dashboard/pergroup/${groupId}-milestones.json`),
    // publications: getData(`https://w3c.github.io/spec-dashboard/pergroup/${groupId}.json`),
  }
  // the repo validator is gathering a lot of useful data, so let's add it
  const report = "https://w3c.github.io/validate-repos/report.json";
  group["repositories"] = getData(report).then(data => {
      return data.groups[groupId].repos.map(repo => {
        let GH = data.repos.filter(r => (r.name === repo.name && r.owner.login === repo.fullName.split('/')[0]))[0];
        GH.fullName = repo.fullName;
        GH.hasRecTrack = GH.w3c["repo-type"].includes("rec-track");
        GH.hasNote = GH.w3c["repo-type"].includes("note");
        return GH;
    }).sort(sortRepo);
  });

  // below is pure convenience

  // associate issues with their repositories
  group["repositories"] = group["repositories"].then(data => {
    return group["dashboard"].repositories.then(dash => {
      data.forEach(repo => {
        let dashrepo = repo.issues = Object.entries(dash)
          .map(r => r[1])
          .filter(r => (r.repo.name === repo.name && r.repo.owner === repo.owner.login))[0];
        if (dashrepo) repo.issues = dashrepo.issues;
      });
      return data;
    });
  });

  // associate milestones and repositories with their publications
  group["specifications"] = group["specifications"].then(specs => {
    return group["dashboard"].milestones.then(stones => {
      Object.entries(stones).forEach(s => {
        let spec = specs.filter(sp => sp.shortlink === s[0]);
        if (spec.length === 1) {
          spec[0].milestones = s[1];
        }
      })
      return specs;
    })
  });

  // annotate with latest status
  group["specifications"] = group["specifications"].then(specs => {
    specs.forEach(spec => {
      spec["latest-version"].then(latest => {spec.status = latest.status});
    })
    return specs;
  });


  return group;
}

// compare functions utils

// first orgs, then individuals
function sortParticipants(a, b) {
  function criteria(v) {
    return ((!v.individual)? "A":"Z")
      + v.title;
  }
  let vA = criteria(a);
  let vB = criteria(b);
  if (vA < vB) {
    return -1;
  }
  if (vA > vB) {
    return 1;
  }

  // must be equal
  return 0;
}

// first rec track, then note, then alphabetical order
function sortRepo(a, b) {
  function criteria(v) {
    return ((v.hasRecTrack)? "A":"Z")
      + ((v.hasNote)? "A" : "Z")
      + v.name;
  }
  let vA = criteria(a);
  let vB = criteria(b);
  if (vA < vB) {
    return -1;
  }
  if (vA > vB) {
    return 1;
  }

  // must be equal
  return 0;
}
