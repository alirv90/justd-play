import {
  Collection,
  UNSTABLE_Virtualizer as Virtualizer,
  UNSTABLE_ListLayout as ListLayout,
  UNSTABLE_Tree as Tree,
  UNSTABLE_TreeItem as TreeItem,
  UNSTABLE_TreeItemContent as TreeItemContent,
  TreeItemProps,
  TreeProps,
  Button,
  Selection,
  Key,
} from "react-aria-components";
import { tv } from "tailwind-variants";

import { Checkbox } from "./components/ui/checkbox";
import { cr } from "./components/ui/primitive";
import { useState, useEffect, useRef } from "react";
import { IconChevronRight } from "justd-icons";

const Indicator = () => {
  return (
    <Button className="shrink-0 relative" slot="chevron">
      <>
        <IconChevronRight className="size-5" />
      </>
    </Button>
  );
};

const ItemCheckbox = () => {
  return <Checkbox slot="selection" />;
};

const ItemLabel = (props: React.HtmlHTMLAttributes<HTMLSpanElement>) => {
  return <span {...props} />;
};

type FileNode = {
  id: number;
  title: string;
  children: FileNode[];
};

const itemStyles = tv({
  base: [
    "[&_[data-expanded]_[slot=chevron]_[data-slot=icon]]:rotate-90 outline-none [--padding:20px] p-[0.286rem_0.286rem_0.286rem_0.571rem] pl-[calc((var(--tree-item-level)-1)*20px+0.571rem+var(--padding))]",
    "[&_[slot=chevron]]:outline-none [&_[slot=chevron]_[data-slot=icon]]:text-muted-fg",
    "data-[has-child-rows]:[--padding:0px]",
  ],
  variants: {
    isExpanded: {
      true: "[&_[slot=chevron]_[data-slot=icon]]:text-fg [&_[slot=chevron]_[data-slot=icon]]:rotate-90 [&_[slot=chevron]_[data-slot=icon]]:transition [&_[slot=chevron]_[data-slot=icon]]:duration-200",
    },
    isFocusVisible: {
      true: "[&_[slot=chevron]_[data-slot=icon]]:text-fg focus:outline-none focus-visible:ring-1 focus-visible:ring-primary",
    },
    isDisabled: {
      true: "opacity-50 forced-colors:text-[GrayText]",
    },
  },
});

const FileTreeItem = (props: TreeItemProps<FileNode>) => {
  const childItems = props.value?.children;
  const itemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.id !== 23) {
      return;
    }

    console.log("focusing");
  }, [props.id]);

  return (
    <>
      <TreeItem
        className={cr(props.className, (className, renderProps) =>
          itemStyles({
            ...renderProps,
            className,
          })
        )}
        ref={itemRef}
        {...props}
      >
        <TreeItemContent>
          {({ hasChildRows }) => (
            <div className="flex items-center">
              {hasChildRows && <Indicator />}
              <ItemCheckbox />
              <ItemLabel>{props.children}</ItemLabel>
            </div>
          )}
        </TreeItemContent>
        <Collection items={childItems}>
          {(item: FileNode) => (
            <FileTreeItem id={item.id} textValue={item.title}>
              {item.title}
            </FileTreeItem>
          )}
        </Collection>
      </TreeItem>
    </>
  );
};

const treeStyles = tv({
  base: "flex border max-h-96 min-w-72 [&::-webkit-scrollbar]:size-0.5 [scrollbar-width:thin] py-2 rounded-lg bg-bg cursor-default lg:text-sm flex-col overflow-auto forced-color-adjust-none outline-none",
  variants: {
    isFocusVisible: {
      true: "outline-offset-[-1px] outline-2 outline-primary",
    },
  },
});

export default function FileExplorer(props: TreeProps<unknown>) {
  const [layout] = useState(() => {
    return new ListLayout({
      rowHeight: 35,
    });
  });
  const [selection, setSelection] = useState<Selection>(new Set([23]));
  const [expandedKeys, setExpandedKeys] = useState<Set<Key>>();
  const treeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    //treeRef.current?.focus();
  }, []);

  return (
    <Virtualizer layout={layout}>
      <Tree
        ref={treeRef}
        className={cr(props.className, (className, renderProps) =>
          treeStyles({
            ...renderProps,
            className,
          })
        )}
        {...props}
        selectionMode="single"
        onSelectionChange={(sel) => {
          setSelection(sel);
        }}
        selectedKeys={selection}
        defaultExpandedKeys={[1, 2, 3, 4, 21, 22, 23]}
        expandedKeys={expandedKeys}
        onExpandedChange={(keys) => {
          setExpandedKeys(keys);
        }}
        aria-label="File Explorer"
        items={files}
      >
        {(item: FileNode) => (
          <FileTreeItem id={item.id} textValue={item.title}>
            {item.title}
          </FileTreeItem>
        )}
      </Tree>
    </Virtualizer>
  );
}

const files: FileNode[] = [
  {
    id: 1,
    title: "Work",
    children: [
      {
        id: 2,
        title: "Reports",
        children: [
          {
            id: 3,
            title: "2023",
            children: [
              {
                id: 4,
                title: "Q1 Report",
                children: [
                  ...Array.from({ length: 100 }, (_, index) => ({
                    id: 1000 + index,
                    title: `Item ${index + 1}`,
                    children: [],
                  })),
                ],
              },
            ],
          },
        ],
      },
      {
        id: 7,
        title: "Presentations",
        children: [
          {
            id: 8,
            title: "2023 Projects",
            children: [
              {
                id: 9,
                title: "Project A",
                children: [
                  { id: 10, title: "Draft", children: [] },
                  { id: 11, title: "Final", children: [] },
                ],
              },
              {
                id: 12,
                title: "Project B",
                children: [{ id: 13, title: "Research", children: [] }],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 14,
    title: "Personal",
    children: [
      {
        id: 15,
        title: "Hobbies",
        children: [
          {
            id: 16,
            title: "Photography",
            children: [
              { id: 17, title: "Travel", children: [] },
              { id: 18, title: "Portraits", children: [] },
            ],
          },
          {
            id: 19,
            title: "Cooking",
            children: [{ id: 20, title: "Recipes", children: [] }],
          },
        ],
      },
    ],
  },
  {
    id: 21,
    title: "Projects",
    children: [
      {
        id: 22,
        title: "Web Development",
        children: [
          {
            id: 23,
            title: "Portfolio",
            children: [
              { id: 24, title: "Images", children: [] },
              { id: 25, title: "CSS", children: [] },
            ],
          },
          { id: 26, title: "Landing Page", children: [] },
        ],
      },
      {
        id: 27,
        title: "Mobile Apps",
        children: [{ id: 28, title: "Weather App", children: [] }],
      },
    ],
  },
  {
    id: 29,
    title: "Finance",
    children: [
      {
        id: 30,
        title: "Budget",
        children: [
          {
            id: 31,
            title: "2023",
            children: [
              { id: 32, title: "January", children: [] },
              { id: 33, title: "February", children: [] },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 34,
    title: "Health",
    children: [
      {
        id: 35,
        title: "Fitness",
        children: [
          { id: 36, title: "Workouts", children: [] },
          { id: 37, title: "Nutrition", children: [] },
        ],
      },
      { id: 38, title: "Wellness", children: [] },
    ],
  },
];
