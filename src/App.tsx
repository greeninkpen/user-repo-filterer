import React, { useState } from 'react';
import './App.css';
import { ApolloClient, InMemoryCache } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import { ReactComponent as SearchIcon } from './search-16.svg';
import { ReactComponent as BookIcon } from './book-16.svg';
import { ReactComponent as RepoIcon } from './repo-16.svg';
import { ReactComponent as ProjectIcon } from './project-16.svg';
import { ReactComponent as PackageIcon } from './package-16.svg';
import { ReactComponent as PeopleIcon } from './people-16.svg';
import { ReactComponent as StarIcon } from './star-16.svg';
import { gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: {
    Authorization: `Bearer ${process.env.REACT_APP_GRAPHQL_API_TOKEN}`,
  },
  cache: new InMemoryCache()
});

const GET_USER_AND_REPOSITORIES = gql`
query GetUserAndRepositories($login: String!) {
  user(login: $login) {
    avatarUrl
    login
    followers {
      totalCount
    }
    following {
      totalCount
    }
    starredRepositories {
      totalCount
    }
    organizations(first:10) {
      nodes {
        avatarUrl
      }
    }
    repositories(first:100) {
      nodes {
        name
        url
        description
        primaryLanguage {
          name
          color
        }
        updatedAt
        viewerHasStarred
      }
    }
  }
}
`;

function App() {
  const [showSearch, setShowSearch] = useState(false)
  const [user, setUser] = useState('');
  const [searchRepo, setSearchRepo] = useState('');
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('all');
  console.log('Search:', user);
  console.log('SearchRepo:', searchRepo)
  const { loading, error, data } = useQuery(GET_USER_AND_REPOSITORIES, {
    variables: { login: user },
    skip: !user,
  });

  const handleKeyPress = async (event: any) => {
    if (event.key === 'Enter') {
      try {
        event.preventDefault(); //prevents default form submission and updates search state var
        setUser(event.target.value);
      } catch (error) {
        console.error(error);
      }
    }
  };
  const handleRepoSearch = async (event: any) => {
    if (event.key === 'Enter') {
      try {
        event.preventDefault();
        const newSearchRepo = event.target.value
        setSearchRepo(newSearchRepo);
        const filteredRepos = await filteredRepositories(newSearchRepo);
        setFilteredRepos(filteredRepos);
        console.log(filteredRepos);
      } catch (error) {
        console.error(error);
        setSearchRepo('');
      }
    }
  };
  const filteredRepositories = (searchTerm: string) => {
    try {
      const filteredRepos = data.user.repositories.nodes.filter((repo: any) => repo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return filteredRepos;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  const handleLanguageChange = (event: any) => {
    const newSelectedLanguage = event.target.value;
    setSelectedLanguage(newSelectedLanguage);
    const filteredRepos = filterRepositoriesByLanguage(newSelectedLanguage);
    setFilteredRepos(filteredRepos);
  }
  const filterRepositoriesByLanguage = (language: string) => {
    if (language === 'all') {
      return data.user.repositories.nodes;
    }
    try {
      const filteredRepos = data.user.repositories.nodes.filter((repo: any) => repo.primaryLanguage && repo.primaryLanguage.name === language
      );
      return filteredRepos;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        {/* lines 10 - 23 will show on screens sized < 601px */}
        <nav className="mobile-nav">
          <button className="back-button">Back</button>
          <h1>Repositories</h1>
          {/* the following sets click event to show/hide the search icon/bar */}
          {!showSearch ? (
            <button className="search-icon" onClick={() => setShowSearch(!showSearch)}>
              <SearchIcon />
            </button>
          ) : (
            <input
              type="search"
              className="user-search-bar"
              name='user-search-bar'
              placeholder="Find a user"
              onKeyDown={handleKeyPress} />
          )}
        </nav>
        {/* navbar for screens >=601px */}
        <nav className='navbar'>
          <ul>
            <li>
              <BookIcon />
              Overview
            </li>
            <li>
              <RepoIcon />
              Repositories
            </li>
            <li>
              <ProjectIcon />
              Projects
            </li>
            <li>
              <PackageIcon />
              Packages
            </li>
            {!showSearch ? (
              <button className="search-icon" onClick={() => setShowSearch(!showSearch)}>
                <SearchIcon />
              </button>
            ) : (
              <input
                type="search"
                className="user-search-bar"
                name="user-search-bar"
                placeholder="Find a user"
                onKeyDown={handleKeyPress} />
            )}
          </ul>

        </nav>
      </header>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <>
          <div className='Layout'>
            <div className='Layout-user-data'>
              <img src={data.user.avatarUrl} alt={data.user.login} />
              <h2 id='username'>{data.user.login}</h2>
              <button id='follow-btn'>Follow</button>
              <p id='followers-following'>
                <span><PeopleIcon /><strong>{data.user.followers.totalCount}</strong> {data.user.followers.totalCount === 1 ? 'follower' : 'followers'} · </span>
                <span><strong>{data.user.following.totalCount}</strong> following · </span>
                <span><StarIcon /> <strong>{data.user.starredRepositories.totalCount}</strong></span>
              </p>
              <p id='organizations'>Organizations</p>
              <div id='orgavatars-container'>
                {data && data.user.organizations.nodes.map((org: any) => (
                  <img id='orgavatar' src={org.avatarUrl} alt={org.name} key={org.name} />
                ))}
              </div>
            </div>
            <div id='Layout-user-repos'>
              <input type="search" className="search-repos" name="search-repos" placeholder="Find a repository"
                // value={searchRepo}
                onKeyDown={handleRepoSearch} />
              <select id="language" name="language" onChange={handleLanguageChange}>
                <option value="all">All</option>
                {data && data.user.repositories.nodes.reduce((languages: string[], repo: any) => {
                  const language = repo.primaryLanguage && repo.primaryLanguage.name;
                  if (language && !languages.includes(language)) {
                    languages.push(language);
                  }
                  return languages;
                }, []).map((language: string) => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
              {filteredRepos.length > 0 ? filteredRepos.map((repo: any) => (
                <div id='repos' key={repo.name}>
                  <a href={repo.url} id='repo-links'>{repo.name}</a>
                  <p className='description'>{repo.description}</p>
                  {repo.primaryLanguage && <p className='description' id='circle-icon'><span style={{
                    display: 'inline-block',
                    height: '10px',
                    width: '10px',
                    backgroundColor: repo.primaryLanguage.color,
                    borderRadius: '50%',
                  }}></span> {repo.primaryLanguage.name}</p>}
                  <p id='updated-on'>Updated on {new Date(repo.updatedAt).toLocaleDateString()}</p>
                </div>
              )) : data && data.user.repositories.nodes.map((repo: any) => (
                <div id='repos' key={repo.name}>
                  <a href={repo.url} id='repo-links'>{repo.name}</a>
                  <p className='description'>{repo.description}</p>
                  {repo.primaryLanguage && <p className='description' id='circle-icon'><span style={{
                    display: 'inline-block',
                    height: '12px',
                    width: '12px',
                    backgroundColor: repo.primaryLanguage.color,
                    borderRadius: '50%',
                  }}></span> {repo.primaryLanguage.name}</p>}
                  <p id='updated-on'>Updated on {new Date(repo.updatedAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default () => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);
