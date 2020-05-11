import React, { useState } from 'react';
import { Button, Divider, Tag, Comment as CommentAntd, Empty, List, Dropdown, Input } from 'antd';
import { Comment } from '../lib/stock';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import { DownOutlined } from '@ant-design/icons';

const CREATE_COMMENT = gql`
  mutation createComment($input: CreateCommentInput!) {
    createComment(input: $input) {
      id
      userId
      message
      tags
      createdAt
    }
  }
`;

interface CommentPanelProps {
  eventDate: string;
  comments: Comment[];
  commentTags: string[];
  tagColorMap: { [key: string]: string };
  marketMenu: JSX.Element;
  handleTagClose: (tag: string) => void;
}

function CommentPanel({
  eventDate,
  comments: commentsProps,
  commentTags,
  marketMenu,
  tagColorMap,
  handleTagClose,
}: CommentPanelProps) {
  const [comments, setComments] = useState<Comment[]>([...commentsProps].reverse());
  const [buttonLoading, setButtonLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [createCommentMutation] = useMutation(CREATE_COMMENT);

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setButtonLoading(true);
    try {
      const createCommentInput = {
        userId: null,
        eventDate: eventDate,
        message: message,
        tags: commentTags,
      };
      const { data } = await createCommentMutation({ variables: { input: createCommentInput } });
      if (data) {
        const myComment: Comment = data.createComment;
        setComments((prev) => [myComment, ...prev]);
        setMessage('');
      }
    } catch (err) {
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="panel comments">
      <h3>의견 남기기</h3>
      <p>
        원하는 종목 및{' '}
        <Dropdown overlay={marketMenu}>
          <Button style={{ padding: 0 }} type="link">
            시장 지수 <DownOutlined />
          </Button>
        </Dropdown>
        를{' '}
        <Button style={{ padding: 0 }} type="link">
          태그
        </Button>
        해서 의견을 남길 수 있어요
      </p>
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <div className="username-tag">
          <span className="username">
            <strong>익명</strong>
          </span>
          {commentTags.map((tag, i) => (
            <Tag
              key={i}
              closable
              color={tagColorMap[tag]}
              onClose={(e: any) => {
                e.preventDefault();
                handleTagClose(tag);
              }}
            >
              {tag}
            </Tag>
          ))}
        </div>
        <Input.TextArea
          placeholder="여기에 입력하세요"
          style={{ fontSize: 16 }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoSize={{ minRows: 2 }}
        />
        <Button className="submit-btn" loading={buttonLoading} htmlType="submit" type="primary">
          저장
        </Button>
      </form>
      <Divider />
      <div className="comment-content">
        {comments.length !== 0 ? (
          <List
            className="comment-list"
            itemLayout="horizontal"
            dataSource={comments}
            pagination={{ defaultPageSize: 10 }}
            renderItem={(item: Comment) => (
              <li>
                <CommentAntd
                  author={item.user?.name || '익명'}
                  content={<p>{item.message}</p>}
                  datetime={item.tags?.map((tag, i) => (
                    <Tag
                      className="tag"
                      key={i}
                      color={tagColorMap[tag]}
                      onClose={(e: any) => {
                        e.preventDefault();
                        handleTagClose(tag);
                      }}
                    >
                      {tag}
                    </Tag>
                  ))}
                />
              </li>
            )}
          />
        ) : (
          <Empty description="처음으로 댓글을 남겨보세요!" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>
    </div>
  );
}

export default CommentPanel;
