import MenuItem from "../models/MenuItem.js";

// @desc    Criar novo item do menu
// @route   POST /api/menu
// @access  Private/Admin
export const createMenuItem = async (req, res) => {
  try {
    const { label, href, order, published, parentId, menuType, contentType, pageId, postId, target } = req.body;

    // Validação básica
    if (!label || !href) {
      return res.status(400).json({
        success: false,
        message: "Label e URL são obrigatórios",
      });
    }

    const menuItem = await MenuItem.create({
      label,
      href,
      order: order || 0,
      published: published !== undefined ? published : true,
      parentId: parentId || null,
      menuType: menuType || 'main',
      contentType: contentType || 'custom',
      pageId: pageId || null,
      postId: postId || null,
      target: target || '_self',
    });

    // Popula dados baseado no tipo de conteúdo
    let populatedMenuItem = await MenuItem.findById(menuItem._id)
      .populate("children")
      .select("-__v");

    if (contentType === 'page' && pageId) {
      populatedMenuItem = await MenuItem.findById(menuItem._id)
        .populate("content")
        .select("-__v");
    }

    if (contentType === 'post' && postId) {
      populatedMenuItem = await MenuItem.findById(menuItem._id)
        .populate("post")
        .select("-__v");
    }

    res.status(201).json({
      success: true,
      data: populatedMenuItem,
      message: "Item do menu criado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar item do menu:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar item do menu",
      error: error.message,
    });
  }
};

// @desc    Listar itens do menu
// @route   GET /api/menu
// @access  Public
export const getMenuItems = async (req, res) => {
  try {
    const { published, menuType } = req.query;
    
    const query = {};
    
    // Filtro por status de publicação
    if (published !== undefined) {
      query.published = published === "true";
    }
    
    // Filtro por tipo de menu
    if (menuType) {
      query.menuType = menuType;
    }

    const menuItems = await MenuItem.find(query)
      .populate([
        { path: "children", select: "label href order published menuType contentType target" },
        { path: "content", select: "title slug published" },
        { path: "post", select: "title slug published coverImage" }
      ])
      .sort({ order: 1, createdAt: 1 })
      .select("-__v");

    res.json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error("Erro ao listar itens do menu:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar itens do menu",
      error: error.message,
    });
  }
};

// @desc    Obter item do menu por ID
// @route   GET /api/menu/:id
// @access  Private/Admin
export const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id)
      .populate("children")
      .select("-__v");

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Item do menu não encontrado",
      });
    }

    res.json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error("Erro ao obter item do menu:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter item do menu",
      error: error.message,
    });
  }
};

// @desc    Atualizar item do menu
// @route   PUT /api/menu/:id
// @access  Private/Admin
export const updateMenuItem = async (req, res) => {
  try {
    const { label, href, order, published, parentId, menuType, contentType, pageId, postId, target } = req.body;

    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Item do menu não encontrado",
      });
    }

    // Verificar se parentId está criando referência circular
    if (parentId && parentId === req.params.id) {
      return res.status(400).json({
        success: false,
        message: "Um item não pode ser pai de si mesmo",
      });
    }

    const updateData = {};
    if (label !== undefined) updateData.label = label;
    if (href !== undefined) updateData.href = href;
    if (order !== undefined) updateData.order = order;
    if (published !== undefined) updateData.published = published;
    if (parentId !== undefined) updateData.parentId = parentId;
    if (menuType !== undefined) updateData.menuType = menuType;
    if (contentType !== undefined) updateData.contentType = contentType;
    if (pageId !== undefined) updateData.pageId = pageId;
    if (postId !== undefined) updateData.postId = postId;
    if (target !== undefined) updateData.target = target;

    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate([
        { path: "children", select: "label href order published menuType contentType target" },
        { path: "content", select: "title slug published" },
        { path: "post", select: "title slug published coverImage" }
      ])
      .select("-__v");

    res.json({
      success: true,
      data: updatedMenuItem,
      message: "Item do menu atualizado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar item do menu:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar item do menu",
      error: error.message,
    });
  }
};

// @desc    Excluir item do menu
// @route   DELETE /api/menu/:id
// @access  Private/Admin
export const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Item do menu não encontrado",
      });
    }

    // Verificar se há itens filhos
    const childItems = await MenuItem.find({ parentId: req.params.id });
    if (childItems.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Não é possível excluir um item que possui subitens",
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Item do menu excluído com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir item do menu:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao excluir item do menu",
      error: error.message,
    });
  }
};

// @desc    Reordenar itens do menu
// @route   PUT /api/menu/reorder
// @access  Private/Admin
export const reorderMenuItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Items deve ser um array",
      });
    }

    // Validar estrutura dos itens
    for (const item of items) {
      if (!item.id || typeof item.order !== "number") {
        return res.status(400).json({
          success: false,
          message: "Cada item deve ter id e order",
        });
      }
    }

    // Atualizar ordem de todos os itens
    const updatePromises = items.map(item =>
      MenuItem.findByIdAndUpdate(item.id, { order: item.order })
    );

    await Promise.all(updatePromises);

    // Retornar itens atualizados
    const updatedMenuItems = await MenuItem.find({})
      .populate("children")
      .sort({ order: 1 })
      .select("-__v");

    res.json({
      success: true,
      data: updatedMenuItems,
      message: "Menu reordenado com sucesso",
    });
  } catch (error) {
    console.error("Erro ao reordenar menu:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao reordenar menu",
      error: error.message,
    });
  }
};

// @desc    Obter páginas disponíveis para seleção
// @route   GET /api/menu/pages
// @access  Private/Admin
export const getAvailablePages = async (req, res) => {
  try {
    const Page = await import("../models/Page.js").then(m => m.default);
    const pages = await Page.find({ published: true })
      .select("title slug")
      .sort({ title: 1 });

    res.json({
      success: true,
      data: pages,
    });
  } catch (error) {
    console.error("Erro ao obter páginas:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter páginas",
      error: error.message,
    });
  }
};

// @desc    Obter posts disponíveis para seleção
// @route   GET /api/menu/posts
// @access  Private/Admin
export const getAvailablePosts = async (req, res) => {
  try {
    const BlogPost = await import("../models/BlogPost.js").then(m => m.default);
    const posts = await BlogPost.find({ published: true })
      .select("title slug coverImage")
      .sort({ title: 1 });

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Erro ao obter posts:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter posts",
      error: error.message,
    });
  }
};
