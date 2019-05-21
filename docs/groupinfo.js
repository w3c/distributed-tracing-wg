
function getW3CData(queryPath) {
  const apiURL = new URL(queryPath, "https://api.w3.org/");
  apiURL.searchParams.set("apikey", "esj1ar4rl3scks04kg8kkwo4kwc8ow4");
  apiURL.searchParams.set("embed", "1");
  return fetch(apiURL).then(r => r.json());
}

let GROUP_INFO = {};
async function allInfo(groupId) {
  if (GROUP_INFO[groupId]) return GROUP_INFO[groupId];
  // else
  const group = await getW3CData(`/groups/${groupId}`);
  const {
    _links: {
      specifications: { href: specsHref },
      chairs: { href: chairsHref },
      "team-contacts": { href: teamContactsHref },
      "participations": { href: participationsHref },
      "services": { href: servicesHref },
      "active-charter": { href: charterHref },
    },
  } = group;
  p_chairs = getW3CData(chairsHref);
  p_teamcontacts = getW3CData(teamContactsHref);
  p_participations = getW3CData(participationsHref);
  p_services = getW3CData(servicesHref);
  p_charter = getW3CData(charterHref);

  group.chairs = (await p_chairs)["_embedded"]["chairs"];
  group["team-contacts"] = (await p_teamcontacts)["_embedded"]["team-contacts"];
  group["participations"] = (await p_participations)["_embedded"]["participations"];
  group["services"] = (await p_services)["_embedded"]["services"];
  group["active-charter"] = await p_charter;
  group["join"] = group["_links"]["join"]["href"];
  group["pp-status"] = group["_links"]["pp-status"]["href"];

  const {
    _links: { specifications },
  } = await getW3CData(specsHref);
  group.specifications = await Promise.all(specifications.map(async ({ href: specHref, title }) => {
    return getW3CData(specHref);
  }));
  GROUP_INFO[groupId] = group;
  return group;
}

async function groupRepos(groupId) {

  const report = "https://w3c.github.io/validate-repos/report.json";

  return fetch(report).then(r => r.json()).then(data => {
    return data.groups[groupId].repos.map(repo => {
      return { name : repo.name, fullName: repo.fullName, hasRecTrack: repo.hasRecTrack, more: data.repos.filter(r => r.name === repo.name)[0] };
    })
  });
}
