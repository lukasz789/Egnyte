const MY_EMAIL = {
  email: "lukaszjanyst@gmail.com",
};
const URL_START = "https://integrations-staging.qa-egnyte.com/intern-task/1";

const HTTP_METHOD = {
  GET: "GET",
  POST: "POST",
};

let token;

const solveAllTasks = () => {
  solveTask1()
    .then((resp1) => {
      console.log("resp1: ", resp1);
      token = resp1["token"];
      return solveTask2(resp1);
    })
    .then((resp2) => {
      console.log("resp2: ", resp2);
      return solveTask3(resp2);
    })
    .then((resp3) => {
      console.log("resp3: ", resp3);
      return solveTask4(resp3);
    })
    .then((resp4) => {
      console.log("resp4: ", resp4);
      return solveTask5(resp4);
    })
    .then((resp5) => {
      console.log("resp5: ", resp5);
      return solveTask6(resp5);
    })
    .then((resp6) => {
      console.log("resp6: ", resp6);
      return solveTask7(resp6);
    })
    .then((resp7) => {
      console.log("resp7: ", resp7);
      return solveTask8(resp7);
    })
    .then((resp8) => {
      console.log("resp8: ", resp8);
      return solveTask9(resp8);
    })
    .then((resp9) => {
      console.log("resp9: ", resp9);
      return submitAll(resp9);
    })
    .then((resp10) => {
      console.log("resp10", resp10);
    });
};

const solveTask1 = () => {
  return sendHttpRequest(
    HTTP_METHOD.POST,
    URL_START,
    { "Content-Type": "application/json" },
    MY_EMAIL
  );
};

const solveTask2 = (resp) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;

  const reqUrl = resp["url"];

  return sendHttpRequest(HTTP_METHOD.GET, reqUrl, headers);
};

const solveTask3 = (resp2) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;

  const url = resp2["url"];
  const decodedValue = atob(resp2["code"]);
  const reqUrl = url + "?code=" + decodedValue;

  return sendHttpRequest(HTTP_METHOD.GET, reqUrl, headers);
};

const solveTask4 = (resp3) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;

  const url = resp3["url"];
  const numberFactorialized = factorial(resp3["number"]);
  const reqUrl = url + "?result=" + numberFactorialized;

  return sendHttpRequest(HTTP_METHOD.GET, reqUrl, headers);
};

const solveTask5 = async (resp4) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;
  headers["Content-Type"] = "application/json";

  const reqUrl = resp4["url"];
  const episodeID = resp4["episodeID"];
  const allEpisodes = await createEpisodesList(resp4["rickAndMortApiUrl"]);
  const namesURLList = createNamesURLList(allEpisodes, episodeID);
  const names = [];

  for (const url of namesURLList) {
    const characterData = await (await fetch(url)).json();
    names.push(characterData.name);
  }

  const body = {
    result: names,
  };

  return sendHttpRequest(HTTP_METHOD.POST, reqUrl, headers, body);
};

const solveTask6 = (resp5) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;
  headers["Content-Type"] = "application/json";

  const reqUrl = resp5["url"];
  const arrayOfStringsSorted = resp5["stringArray"].sort();

  const body = {
    result: arrayOfStringsSorted.reverse(),
  };

  return sendHttpRequest(HTTP_METHOD.POST, reqUrl, headers, body);
};

const solveTask7 = (resp6) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;
  headers["Content-Type"] = "application/json";

  const reqUrl = resp6["url"];
  const arrayOfNumbersSorted = resp6["numberArray"]
    .sort((a, b) => a - b)
    .reverse();

  const body = {
    result: arrayOfNumbersSorted,
  };

  return sendHttpRequest(HTTP_METHOD.POST, reqUrl, headers, body);
};

const solveTask8 = (resp7) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;
  headers["Content-Type"] = "application/json";

  const reqUrl = resp7["url"];
  const minToEqualize = countMinToDelete(resp7["equalizeArray"]);

  const body = {
    result: minToEqualize,
  };

  return sendHttpRequest(HTTP_METHOD.POST, reqUrl, headers, body);
};

const solveTask9 = async (resp8) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;
  headers["Content-Type"] = "application/json";

  const reqUrl = resp8["url"];
  const dataArray = [];

  for (let i = 1; i < 6; i++) {
    const dataURL = reqUrl + `?page=${i}`;
    const dataReq = await fetch(dataURL, {
      method: HTTP_METHOD.GET,
      headers: headers,
    });
    const fullData = await dataReq.json();
    dataArray.push(fullData);
  }

  const mergedDataArray = mergeArrayOfObjects(dataArray);

  const body = {
    result: mergedDataArray,
  };

  return sendHttpRequest(HTTP_METHOD.POST, reqUrl, headers, body);
};

const submitAll = async (resp9) => {
  const headers = {};
  headers["Authorization"] = "Bearer " + token;
  headers["Content-Type"] = "application/json";

  const reqUrl = resp9["url"];

  body = {
    githubUrl: "https://github.com/lukasz789/Egnyte",
  };

  return sendHttpRequest(HTTP_METHOD.POST, reqUrl, headers, body);
};

const sendHttpRequest = (method, url, headers, body) => {
  return fetch(url, {
    method: method,
    body: JSON.stringify(body),
    headers: headers,
  }).then((resp) => resp.json());
};

const factorial = (n) => {
  let result = 1;
  if (n == 0 || n == 1) {
    return result;
  } else {
    for (let i = n; i >= 1; i--) {
      result = result * i;
    }
    return result;
  }
};

const createNamesURLList = (episodeList, episodeId) => {
  for (const element of episodeList) {
    if (episodeId === element.id) {
      return element.characters;
    }
  }
};

const createEpisodesList = async (rickAndMortApiUrl) => {
  const episodesData = await (await fetch(rickAndMortApiUrl)).json();
  const episodes1 = episodesData.results;
  const episodesData2 = await (
    await fetch(rickAndMortApiUrl + "?page=2")
  ).json();
  const episodes2 = episodesData2.results;
  const episodesData3 = await (
    await fetch(rickAndMortApiUrl + "?page=3")
  ).json();
  const episodes3 = episodesData3.results;
  const allEpisodes = [...episodes1, ...episodes2, ...episodes3];
  return allEpisodes;
};

const countMinToDelete = (arr) => {
  const frequency = {};
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] in frequency) {
      frequency[arr[i]] += 1;
    } else {
      frequency[arr[i]] = 1;
    }
  }

  const maxRepetition = Math.max(...Object.values(frequency));

  return arr.length - maxRepetition;
};

const mergeArrayOfObjects = (data) => {
  const result = {};

  data.forEach((object) => {
    for (let [key, value] of Object.entries(object)) {
      if (result[key]) {
        result[key] += value;
      } else {
        result[key] = value;
      }
    }
  });
  return result;
};

solveAllTasks();
