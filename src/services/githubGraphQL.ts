import type { LanguageStat, ReqType } from "../types/github";

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const graphqlEndpoint = "https://api.github.com/graphql";

type GraphQLResponse<T> = {
  data?: T;
  errors?: { message: string }[];
};

const headers: HeadersInit = GITHUB_TOKEN
  ? {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "Content-Type": "application/json",
    }
  : {};

async function graphqlRequest<T>(query: string, variables = {}): Promise<T> {
  const res = await fetch(graphqlEndpoint, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  if (!json.data) {
    throw new Error("No data returned from GraphQL");
  }

  return json.data;
}

async function fetchUserLanguages(username: string): Promise<LanguageStat[]> {
  const query = `
        query($login: String!) {
            user(login: $login) {
                repositories(first: 100, ownerAffiliations: OWNER) {
                    edges {
                        node {
                            languages(first: 10) {
                                edges {
                                    node {
                                        name
                                        color
                                    }
                                    size
                                }
                            }
                        }
                    }
                }
            }
        }
    `;

  // const data = await graphqlRequest<{
  //   user: {
  //     repositories: {
  //       edges: {
  //         node: {
  //           languages: {
  //             edges: { node: { name: string; color: string }; size: number }[];
  //           };
  //         };
  //       }[];
  //     };
  //   };
  // }>(query, { login: username });

  const data = await graphqlRequest<ReqType>(query, {
    login: username,
  });

  // Aggregate language sizes
  const langMap = new Map<string, { color: string; size: number }>();

  data.user.repositories.edges.forEach(({ node }) => {
    node.languages.edges.forEach(({ node: langNode, size }) => {
      if (langMap.has(langNode.name)) {
        langMap.get(langNode.name)!.size += size;
      } else {
        langMap.set(langNode.name, { color: langNode.color, size });
      }
    });
  });

  // Convert to array and sort descending by size
  return Array.from(langMap.entries())
    .map(([name, { color, size }]) => ({ name, color, size }))
    .sort((a, b) => b.size - a.size);
}

export { graphqlRequest, fetchUserLanguages };
