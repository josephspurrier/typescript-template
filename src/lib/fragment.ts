export interface FragmentAttrs {
  children: JSX.Vnode[];
}

export const createFragment = (
  attrs: FragmentAttrs,
): JSX.Vnode[] | string[] => {
  return attrs.children;
};

// Removes any "FRAGMENT" elements from the state to make the dom comparisons
// easier to work with.
export const removeFragments = (vn: JSX.Vnode): JSX.Vnode => {
  const cleanChildren = (vn: JSX.Vnode): (string | JSX.Vnode)[] => {
    const rChildren = [] as (string | JSX.Vnode)[];
    vn.children.forEach((element: JSX.Vnode | string) => {
      const vc = element as JSX.Vnode;
      if (vc.tag) {
        if (vc.tag === 'FRAGMENT') {
          rChildren.push(...cleanChildren(vc));
        } else {
          rChildren.push(removeFragments(vc));
        }
      } else {
        rChildren.push(element);
      }
    });

    return rChildren;
  };

  return {
    tag: vn.tag,
    attrs: vn.attrs,
    children: cleanChildren(vn),
  } as JSX.Vnode;
};
