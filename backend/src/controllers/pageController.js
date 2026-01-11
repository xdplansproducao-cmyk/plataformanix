import Page from "../models/Page.js";

// @desc    Criar nova página
// @route   POST /api/pages
// @access  Private/Admin
export const createPage = async (req, res) => {
  try {
    const { title, slug, content, metaTitle, metaDescription, published } = req.body;

    // Validação básica
    if (!title || !slug || !content) {
      return res.status(400).json({
        success: false,
        message: "Título, slug e conteúdo são obrigatórios",
      });
    }

    // Verificar se slug já existe
    const existingPage = await Page.findOne({ slug });
    if (existingPage) {
      return res.status(400).json({
        success: false,
        message: "Já existe uma página com este slug",
      });
    }

    const page = await Page.create({
      title,
      slug,
      content,
      metaTitle,
      metaDescription,
      published: published || false,
    });

    res.status(201).json({
      success: true,
      data: page,
      message: "Página criada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao criar página:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar página",
      error: error.message,
    });
  }
};

// @desc    Listar páginas
// @route   GET /api/pages
// @access  Private/Admin
export const getPages = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      published,
      search,
      sort = "createdAt",
      order = "desc",
    } = req.query;

    const query = {};

    // Filtro por status
    if (published !== undefined) {
      query.published = published === "true";
    }

    // Busca por texto
    if (search) {
      query.$text = { $search: search };
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sort] = order === "desc" ? -1 : 1;

    const [pages, total] = await Promise.all([
      Page.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .select("-__v"),
      Page.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: pages,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao listar páginas:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao listar páginas",
      error: error.message,
    });
  }
};

// @desc    Obter página por ID
// @route   GET /api/pages/:id
// @access  Private/Admin
export const getPageById = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id).select("-__v");

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Página não encontrada",
      });
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error("Erro ao obter página:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter página",
      error: error.message,
    });
  }
};

// @desc    Obter página por slug (pública)
// @route   GET /api/pages/slug/:slug
// @access  Public
export const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ 
      slug: req.params.slug, 
      published: true 
    }).select("-__v");

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Página não encontrada",
      });
    }

    res.json(page);
  } catch (error) {
    console.error("Erro ao obter página por slug:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao obter página",
      error: error.message,
    });
  }
};

// @desc    Atualizar página
// @route   PUT /api/pages/:id
// @access  Private/Admin
export const updatePage = async (req, res) => {
  try {
    const { title, slug, content, metaTitle, metaDescription, published } = req.body;

    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Página não encontrada",
      });
    }

    // Verificar se novo slug já existe (se foi alterado)
    if (slug && slug !== page.slug) {
      const existingPage = await Page.findOne({ slug, _id: { $ne: req.params.id } });
      if (existingPage) {
        return res.status(400).json({
          success: false,
          message: "Já existe uma página com este slug",
        });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (slug !== undefined) updateData.slug = slug;
    if (content !== undefined) updateData.content = content;
    if (metaTitle !== undefined) updateData.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateData.metaDescription = metaDescription;
    if (published !== undefined) {
      updateData.published = published;
      // Se estiver publicando e não tinha data de publicação
      if (published && !page.publishedAt) {
        updateData.publishedAt = new Date();
      }
      // Se estiver despublicando, limpa a data de publicação
      if (!published) {
        updateData.publishedAt = null;
      }
    }

    const updatedPage = await Page.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-__v");

    res.json({
      success: true,
      data: updatedPage,
      message: "Página atualizada com sucesso",
    });
  } catch (error) {
    console.error("Erro ao atualizar página:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar página",
      error: error.message,
    });
  }
};

// @desc    Excluir página
// @route   DELETE /api/pages/:id
// @access  Private/Admin
export const deletePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Página não encontrada",
      });
    }

    await Page.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Página excluída com sucesso",
    });
  } catch (error) {
    console.error("Erro ao excluir página:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao excluir página",
      error: error.message,
    });
  }
};
