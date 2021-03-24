import React, { ReactElement } from 'react';
import { Router } from '@reach/router';
import NotFoundPage from './404';
import GroupSelectPage from '../components/Groups/GroupSelectPage';
import GroupPage from '../components/Groups/GroupPage/GroupPage';
import PostPage from '../components/Groups/PostPage/PostPage';
import ProblemPage from '../components/Groups/ProblemPage/ProblemPage';
import EditPostPage from '../components/Groups/EditPostPage/EditPostPage';
import EditProblemPage from '../components/Groups/EditProblemPage/EditProblemPage';
import {
  ActiveGroupProvider,
  useActiveGroup,
} from '../hooks/groups/useActiveGroup';
import { ProblemSubmissionPopupProvider } from '../components/Groups/ProblemSubmissionPopup';
import JoinGroupPage from '../components/Groups/JoinGroupPage';
import EditGroupPage from '../components/Groups/EditGroupPage/EditGroupPage';
import Layout from '../components/layout';
import TopNavigationBar from '../components/TopNavigationBar/TopNavigationBar';
import { Link } from 'gatsby';
import UserDataContext from '../context/UserDataContext/UserDataContext';
import JoinLinksPage from '../components/Groups/JoinLinksPage/JoinLinksPage';
import {
  ActivePostProblemsProvider,
  useActivePostProblems,
} from '../hooks/groups/useActivePostProblems';
import PostLeaderboardPage from '../components/Groups/PostLeaderboardPage/PostLeaderboardPage';
import GroupLeaderboardPage from '../components/Groups/GroupLeaderboardPage/GroupLeaderboardPage';

// wrapper because reach router types are bad.
const NotFoundPageWrapper = (props: any): ReactElement => {
  return <NotFoundPage {...props} />;
};

const GroupPageWrapper = (props: any): ReactElement => {
  const { Component, ...propsExceptComponent } = props;
  const { setActiveGroupId, isLoading, groupData } = useActiveGroup();
  const { firebaseUser, isLoaded, signIn } = React.useContext(UserDataContext);

  React.useEffect(() => {
    setActiveGroupId(props.groupId);
  }, [props.groupId]);

  if (isLoaded && !firebaseUser?.uid) {
    return (
      <Layout>
        <TopNavigationBar />
        <main className="text-center py-10">
          <p className="font-medium text-2xl">
            You need to sign in to access groups.{' '}
            <button
              onClick={() => signIn()}
              className="focus:outline-none underline text-blue-600 dark:text-blue-300"
            >
              Sign in now
            </button>
          </p>
        </main>
      </Layout>
    );
  }
  if (isLoading || (groupData && groupData.id !== props.groupId)) {
    return (
      <Layout>
        <TopNavigationBar />
        <main className="text-center py-10">
          <p className="font-medium text-2xl">Loading...</p>
        </main>
      </Layout>
    );
  }
  if (!groupData) {
    return (
      <Layout>
        <TopNavigationBar />
        <main className="text-center py-10">
          <p className="font-medium text-2xl">
            Group not found.{' '}
            <Link
              to="/groups"
              className="text-blue-600 dark:text-blue-400 underline"
            >
              Return Home.
            </Link>
          </p>
        </main>
      </Layout>
    );
  }

  return <Component {...propsExceptComponent} />;
};

const SetActivePost = (props: any): ReactElement => {
  const { Component, ...propsExceptComponent } = props;
  const { setActivePostId } = useActivePostProblems();

  React.useEffect(() => {
    setActivePostId(props.postId);
  }, [props.postId]);

  return <Component {...propsExceptComponent} />;
};

const PostPageWrapper = (props: any): ReactElement => {
  const { Component, ...propsExceptComponent } = props;
  return (
    <GroupPageWrapper
      {...propsExceptComponent}
      Component={props => <SetActivePost {...props} Component={Component} />}
    />
  );
};

export default function GroupsRouter() {
  return (
    <ActiveGroupProvider>
      <ActivePostProblemsProvider>
        <ProblemSubmissionPopupProvider>
          <Router basepath="/groups">
            <PostPageWrapper
              Component={EditProblemPage}
              path="/:groupId/post/:postId/problems/:problemId/edit"
            />
            <PostPageWrapper
              Component={ProblemPage}
              path="/:groupId/post/:postId/problems/:problemId"
            />
            <PostPageWrapper
              Component={EditPostPage}
              path="/:groupId/post/:postId/edit"
            />
            <PostPageWrapper
              Component={PostLeaderboardPage}
              path="/:groupId/post/:postId/leaderboard"
            />
            <PostPageWrapper
              Component={PostPage}
              path="/:groupId/post/:postId"
            />
            <GroupPageWrapper Component={EditGroupPage} path="/:groupId/edit" />
            <GroupPageWrapper
              Component={JoinLinksPage}
              path="/:groupId/join-links"
            />
            <GroupPageWrapper
              Component={GroupLeaderboardPage}
              path="/:groupId/leaderboard"
            />
            <GroupPageWrapper Component={GroupPage} path="/:groupId" />
            <GroupSelectPage path="/" />
            <JoinGroupPage path="/join" />
            <NotFoundPageWrapper default />
          </Router>
        </ProblemSubmissionPopupProvider>
      </ActivePostProblemsProvider>
    </ActiveGroupProvider>
  );
}
