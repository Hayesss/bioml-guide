// Auto-generated from .claude/skills/single-*/SKILL.md
// Contains full skill documentation content

export interface SkillSection {
  title: string;
  content: string;
}

export interface FullSkillData {
  key: string;
  name: string;
  title: string;
  description: string;
  sections: SkillSection[];
}

const _single_preprocessing: FullSkillData = {
  key: "single-preprocessing",
  name: "single-cell-preprocessing-with-omicverse",
  title: "Single-cell preprocessing with omicverse",
  description: "Single-cell QC, normalization, HVG detection, PCA, neighbor graph, UMAP/tSNE embedding pipelines in OmicVerse (CPU/GPU).",
  sections: [
    {
      title: "Overview",
      content: `Follow this skill when a user needs to reproduce the preprocessing workflow from the omicverse notebooks [\`t_preprocess.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_preprocess.ipynb), [\`t_preprocess_cpu.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_preprocess_cpu.ipynb), and [\`t_preprocess_gpu.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_preprocess_gpu.ipynb). The tutorials operate on the 10x PBMC3k dataset and cover QC filtering, normalisation, highly variable gene (HVG) detection, dimensionality reduction, and downstream embeddings.`
    },
    {
      title: "Instructions",
      content: `1. **Set up the environment**
   - Import \`omicverse as ov\` and \`scanpy as sc\`, then call \`ov.plot_set(font_path='Arial')\` (or \`ov.ov_plot_set()\` in legacy notebooks) to standardise figure styling.
   - Encourage \`%load_ext autoreload\` and \`%autoreload 2\` when iterating inside notebooks so code edits propagate without restarting the kernel.
2. **Prepare input data**
   - Download the PBMC3k filtered matrix from 10x Genomics (\`pbmc3k_filtered_gene_bc_matrices.tar.gz\`) and extract it under \`data/filtered_gene_bc_matrices/hg19/\`.
   - Load the matrix via \`ov.io.read_10x_mtx(..., var_names='gene_symbols')\` and keep a writable folder like \`write/\` for exports.
3. **Perform quality control (QC)**
   - Run \`ov.pp.qc(adata, tresh={'mito_perc': 0.2, 'nUMIs': 500, 'detected_genes': 250}, doublets_method='scrublet')\` for the CPU/CPU–GPU pipelines; omit \`doublets_method\` on pure GPU where Scrublet is not yet supported.
   - Review the returned AnnData summary to confirm doublet rates and QC thresholds; advise adjusting cut-offs for different species or sequencing depths.
4. **Store raw counts before transformations**
   - Call \`ov.utils.store_layers(adata, layers='counts')\` immediately after QC so the original counts remain accessible for later recovery and comparison.
5. **Normalise and select HVGs**
   - Use \`ov.pp.preprocess(adata, mode='shiftlog|pearson', n_HVGs=2000, target_sum=5e5)\` to apply shift-log normalisation followed by Pearson residual HVG detection (set \`target_sum=None\` on GPU, which keeps defaults).
   - For CPU–GPU mixed runs, demonstrate \`ov.pp.recover_counts(...)\` to invert normalisation and store reconstructed counts in \`adata.layers['recover_counts']\`.
6. **Manage \`.raw\` and layer recovery**
   - Snapshot normalised data to \`.raw\` with \`adata.raw = adata\` (or \`adata.raw = adata.copy()\`), and show \`ov.utils.retrieve_layers(adata_counts, layers='counts')\` to compare normalised vs. raw intensities.
7. **Scale, reduce, and embed**
   - Scale features using \`ov.pp.scale(adata)\` (layers hold scaled matrices) followed by \`ov.pp.pca(adata, layer='scaled', n_pcs=50)\`.
   - Construct neighbourhood graphs with:
     - \`sc.pp.neighbors(adata, n_neighbors=15, n_pcs=50, use_rep='scaled|original|X_pca')\` for the baseline notebook.
     - \`ov.pp.neighbors(..., use_rep='scaled|original|X_pca')\` on CPU–GPU to leverage accelerated routines.
     - \`ov.pp.neighbors(..., method='cagra')\` on GPU to call RAPIDS graph primitives.
   - Generate embeddings via \`ov.utils.mde(...)\`, \`ov.pp.umap(adata)\`, \`ov.pp.mde(...)\`, \`ov.pp.tsne(...)\`, or \`ov.pp.sude(...)\` depending on the notebook variant.
8. **Cluster and annotate**
   - Run \`ov.pp.leiden(adata, resolution=1)\` or \`ov.single.leiden(adata, resolution=1.0)\` after neighbour graph construction; CPU–GPU pipelines also showcase \`ov.pp.score_genes_cell_cycle\` before clustering.
   - **IMPORTANT - Defensive checks**: When generating code that plots by clustering results (e.g., \`color='leiden'\`), always check if the clustering has been performed first:
     \`\`\`python
     # Check if leiden clustering exists, if not, run it
     if 'leiden' not in adata.obs:
         if 'neighbors' not in adata.uns:
             ov.pp.neighbors(adata, n_neighbors=15, use_rep='X_pca')
         ov.single.leiden(adata, resolution=1.0)
     \`\`\`
   - Plot embeddings with \`ov.pl.embedding(...)\` or \`ov.pl.umap(...)\`, colouring by \`leiden\` clusters and marker genes. Always verify that the column specified in \`color=\` parameter exists in \`adata.obs\` before plotting.
9. **Document outputs**
   - Encourage saving intermediate AnnData objects (\`adata.write('write/pbmc3k_preprocessed.h5ad')\`) and figure exports using Matplotlib’s \`plt.savefig(...)\` to preserve QC summaries and embeddings.
10. **Notebook-specific notes**
    - *Baseline (\`t_preprocess.ipynb\`)*: Focuses on CPU execution with Scanpy neighbours; emphasise storing counts before and after \`retrieve_layers\` demonstrations.
    - *CPU–GPU mixed (\`t_preprocess_cpu.ipynb\`)*: Highlights Omicverse ≥1.7.0 mixed acceleration. Include timing magics (%%time) to showcase speedups and call out \`doublets_method='scrublet'\` support.
    - *GPU (\`t_preprocess_gpu.ipynb\`)*: Requires a CUDA-capable GPU, RAPIDS 24.04 stack, and \`rapids-singlecell\`. Mention the \`ov.pp.anndata_to_GPU\`/\`ov.pp.anndata_to_CPU\` transfers and \`method='cagra'\` neighbours. Note the current warning that pure-GPU pipelines depend on RAPIDS updates.
11. **Troubleshooting tips**
    - If \`ov.io.read_10x_mtx\` fails, verify the extracted folder structure and ensure gene symbols are available via \`var_names='gene_symbols'\`.
    - Address GPU import errors by confirming the conda environment matches the RAPIDS version for the installed CUDA driver (\`nvidia-smi\`).
    - For \`ov.pp.preprocess\` dimension mismatches, ensure QC filtered out empty barcodes so HVG selection does not encounter zero-variance features.
    - When embeddings lack expected fields (e.g., \`scaled|original|X_pca\` missing), re-run \`ov.pp.scale\` and \`ov.pp.pca\` to rebuild the cached layers.
    - **Pipeline dependency errors**: When encountering errors like "Could not find 'leiden' in adata.obs or adata.var_names":
      - Always check if required preprocessing steps (neighbors, PCA) exist before dependent operations
      - Check if clustering results exist in \`adata.obs\` before trying to color plots by them
      - Use defensive checks in generated code to handle incomplete pipelines gracefully
    - **Code generation best practice**: Generate robust code with conditional checks for prerequisites rather than assuming perfect sequential execution. Users may run steps in separate sessions or skip intermediate steps.`
    },
    {
      title: "Critical API Reference - Batch Column Handling",
      content: `### Batch Column Validation - REQUIRED Before Batch Operations

**IMPORTANT**: Always validate and prepare the batch column before any batch-aware operations (batch correction, integration, etc.). Missing or NaN values will cause errors.

**CORRECT usage:**
\`\`\`python
# Step 1: Check if batch column exists, create default if not
if 'batch' not in adata.obs.columns:
    adata.obs['batch'] = 'batch_1'  # Default single batch

# Step 2: Handle NaN/missing values - CRITICAL!
adata.obs['batch'] = adata.obs['batch'].fillna('unknown')

# Step 3: Convert to categorical for efficient memory usage
adata.obs['batch'] = adata.obs['batch'].astype('category')

# Now safe to use in batch-aware operations
ov.pp.combat(adata, batch='batch')  # or other batch correction methods
\`\`\`

**WRONG - DO NOT USE:**
\`\`\`python
# WRONG! Using batch column without validation can cause NaN errors
# ov.pp.combat(adata, batch='batch')  # May fail if batch has NaN values!

# WRONG! Assuming batch column exists
# adata.obs['batch'].unique()  # KeyError if column doesn't exist!
\`\`\`

### Common Batch-Related Pitfalls

1. **NaN values in batch column**: Always use \`fillna()\` before batch operations
2. **Missing batch column**: Always check existence before use
3. **Non-categorical batch**: Convert to category for memory efficiency
4. **Mixed data types**: Ensure consistent string type before categorization

\`\`\`python
# Complete defensive batch preparation pattern:
def prepare_batch_column(adata, batch_key='batch', default_batch='batch_1'):
    """Prepare batch column for batch-aware operations."""
    if batch_key not in adata.obs.columns:
        adata.obs[batch_key] = default_batch
    adata.obs[batch_key] = adata.obs[batch_key].fillna('unknown')
    adata.obs[batch_key] = adata.obs[batch_key].astype(str).astype('category')
    return adata
\`\`\``
    },
    {
      title: "Highly Variable Genes (HVG) - Small Dataset Handling",
      content: `### LOESS Failure with Small Batches

**IMPORTANT**: The \`seurat_v3\` HVG flavor uses LOESS regression which fails on small datasets or small per-batch subsets (<500 cells per batch). This manifests as:
\`\`\`
ValueError: Extrapolation not allowed with blending
\`\`\`

**CORRECT - Use try/except fallback pattern:**
\`\`\`python
# Robust HVG selection for any dataset size
try:
    sc.pp.highly_variable_genes(
        adata,
        flavor='seurat_v3',
        n_top_genes=2000,
        batch_key='batch'  # if batch correction is needed
    )
except ValueError as e:
    if 'Extrapolation' in str(e) or 'LOESS' in str(e):
        # Fallback to simpler method for small datasets
        sc.pp.highly_variable_genes(
            adata,
            flavor='seurat',  # Works with any size
            n_top_genes=2000
        )
    else:
        raise
\`\`\`

**Alternative - Use cell_ranger flavor for batch-aware HVG:**
\`\`\`python
# cell_ranger flavor is more robust for batched data
sc.pp.highly_variable_genes(
    adata,
    flavor='cell_ranger',  # No LOESS, works with batches
    n_top_genes=2000,
    batch_key='batch'
)
\`\`\`

### Best Practices for Batch-Aware HVG

1. **Check batch sizes before HVG**: Small batches (<500 cells) will cause LOESS to fail
2. **Prefer \`seurat\` or \`cell_ranger\`** when batch sizes vary significantly
3. **Use \`seurat_v3\` only** when all batches have >500 cells
4. **Always wrap in try/except** when dataset size is unknown

\`\`\`python
# Safe batch-aware HVG pattern
def safe_highly_variable_genes(adata, batch_key='batch', n_top_genes=2000):
    """Select HVGs with automatic fallback for small batches."""
    try:
        sc.pp.highly_variable_genes(
            adata, flavor='seurat_v3', n_top_genes=n_top_genes, batch_key=batch_key
        )
    except ValueError:
        # Fallback for small batches
        sc.pp.highly_variable_genes(
            adata, flavor='seurat', n_top_genes=n_top_genes
        )
\`\`\``
    },
    {
      title: "Examples",
      content: `- "Download PBMC3k counts, run QC with Scrublet, normalise with \`shiftlog|pearson\`, and compute MDE + UMAP embeddings on CPU."
- "Set up the mixed CPU–GPU workflow in a fresh conda env, recover raw counts after normalisation, and score cell cycle phases before Leiden clustering."
- "Provision a RAPIDS environment, transfer AnnData to GPU, run \`method='cagra'\` neighbours, and return embeddings to CPU for plotting."`
    },
    {
      title: "References",
      content: `- Detailed walkthrough notebooks: [\`t_preprocess.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_preprocess.ipynb), [\`t_preprocess_cpu.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_preprocess_cpu.ipynb), [\`t_preprocess_gpu.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_preprocess_gpu.ipynb)
- Quick copy/paste commands: [\`reference.md\`](reference.md)`
    },
  ]
};

const _single_clustering: FullSkillData = {
  key: "single-clustering",
  name: "single-cell-clustering-and-batch-correction-with-omicverse",
  title: "Single-cell clustering and batch correction with omicverse",
  description: "Single-cell clustering (Leiden, Louvain, scICE, GMM), batch correction (Harmony, scVI, BBKNN, Combat), topic modeling, and cNMF in OmicVerse.",
  sections: [
    {
      title: "Overview",
      content: `This skill distills the single-cell tutorials [\`t_cluster.ipynb\`](../../omicverse_guide/docs/Tutorials-single/t_cluster.ipynb) and [\`t_single_batch.ipynb\`](../../omicverse_guide/docs/Tutorials-single/t_single_batch.ipynb). Use it when a user wants to preprocess an \`AnnData\` object, explore clustering alternatives (Leiden, Louvain, scICE, GMM, topic/cNMF models), and evaluate or harmonise batches with omicverse utilities.`
    },
    {
      title: "Instructions",
      content: `1. **Import libraries and set plotting defaults**
   - Load \`omicverse as ov\`, \`scanpy as sc\`, and plotting helpers (\`scvelo as scv\` when using dentate gyrus demo data).
   - Apply \`ov.plot_set()\` or \`ov.utils.ov_plot_set()\` so figures adopt omicverse styling before embedding plots.
2. **Load data and annotate batches**
   - For demo clustering, fetch \`scv.datasets.dentategyrus()\`; for integration, read provided \`.h5ad\` files via \`ov.read()\` and set \`adata.obs['batch']\` identifiers for each cohort.
   - Confirm inputs are sparse numeric matrices; convert with \`adata.X = adata.X.astype(np.int64)\` when required for QC steps.
3. **Run quality control**
   - Execute \`ov.pp.qc(adata, tresh={'mito_perc': 0.2, 'nUMIs': 500, 'detected_genes': 250}, batch_key='batch')\` to drop low-quality cells and inspect summary statistics per batch.
   - Save intermediate filtered objects (\`adata.write_h5ad(...)\`) so users can resume from clean checkpoints.
4. **Preprocess and select features**
   - Call \`ov.pp.preprocess(adata, mode='shiftlog|pearson', n_HVGs=3000, batch_key=None)\` to normalise, log-transform, and flag highly variable genes; assign \`adata.raw = adata\` and subset to \`adata.var.highly_variable_features\` for downstream modelling.
   - Scale expression (\`ov.pp.scale(adata)\`) and compute PCA scores with \`ov.pp.pca(adata, layer='scaled', n_pcs=50)\`. Encourage reviewing variance explained via \`ov.utils.plot_pca_variance_ratio(adata)\`.
5. **Construct neighbourhood graph and baseline clustering**
   - Build neighbour graph using \`sc.pp.neighbors(adata, n_neighbors=15, n_pcs=50, use_rep='scaled|original|X_pca')\` or \`ov.pp.neighbors(...)\`.
   - Generate Leiden or Louvain labels through \`ov.utils.cluster(adata, method='leiden'|'louvain', resolution=1)\`, \`ov.single.leiden(adata, resolution=1.0)\`, or \`ov.pp.leiden(adata, resolution=1)\`; remind users that resolution tunes granularity.
   - **IMPORTANT - Dependency checks**: Always verify prerequisites before clustering or plotting:
     \`\`\`python
     # Before clustering: check neighbors graph exists
     if 'neighbors' not in adata.uns:
         if 'X_pca' in adata.obsm:
             ov.pp.neighbors(adata, n_neighbors=15, use_rep='X_pca')
         else:
             raise ValueError("PCA must be computed before neighbors graph")

     # Before plotting by cluster: check clustering was performed
     if 'leiden' not in adata.obs:
         ov.single.leiden(adata, resolution=1.0)
     \`\`\`
   - Visualise embeddings with \`ov.pl.embedding(adata, basis='X_umap', color=['clusters','leiden'], frameon='small', wspace=0.5)\` and confirm cluster separation. Always check that columns in \`color=\` parameter exist in \`adata.obs\` before plotting.
6. **Explore advanced clustering strategies**
   - **scICE consensus**: instantiate \`model = ov.utils.cluster(adata, method='scICE', use_rep='scaled|original|X_pca', resolution_range=(4,20), n_boot=50, n_steps=11)\` and inspect stability via \`model.plot_ic(figsize=(6,4))\` before selecting \`model.best_k\` groups.
   - **Gaussian mixtures**: run \`ov.utils.cluster(..., method='GMM', n_components=21, covariance_type='full', tol=1e-9, max_iter=1000)\` for model-based assignments.
   - **Topic modelling**: fit \`LDA_obj = ov.utils.LDA_topic(...)\`, review \`LDA_obj.plot_topic_contributions(6)\`, derive cluster calls with \`LDA_obj.predicted(k)\` and optionally refine using \`LDA_obj.get_results_rfc(...)\`.
   - **cNMF programs**: initialise \`cnmf_obj = ov.single.cNMF(... components=np.arange(5,11), n_iter=20, num_highvar_genes=2000, output_dir=...)\`, factorise (\`factorize\`, \`combine\`), select K via \`k_selection_plot\`, and propagate usage scores back with \`cnmf_obj.get_results(...)\` and \`cnmf_obj.get_results_rfc(...)\`.
7. **Evaluate clustering quality**
   - Compare predicted labels against known references with \`adjusted_rand_score(adata.obs['clusters'], adata.obs['leiden'])\` and report metrics for each method (Leiden, Louvain, GMM, LDA variants, cNMF models) to justify chosen parameters.
8. **Embed with multiple layouts**
   - Use \`ov.utils.mde(...)\` to create MDE projections from different latent spaces (\`adata.obsm["scaled|original|X_pca"]\`, harmonised embeddings, topic compositions) and plot via \`ov.pl.embedding(..., color=['batch','cell_type'])\` or \`ov.pl.embedding\` for consistent review of cluster/batch mixing.
9. **Perform batch correction and integration**
   - Apply \`ov.single.batch_correction(adata, batch_key='batch', methods='harmony'|'combat'|'scanorama'|'scVI'|'CellANOVA', n_pcs=50, ...)\` sequentially to generate harmonised embeddings stored in \`adata.obsm\` (\`X_harmony\`, \`X_combat\`, \`X_scanorama\`, \`X_scVI\`, \`X_cellanova\`). For \`scVI\`, mention latent size (\`n_latent=30\`) and \`gene_likelihood="nb"\`; for CellANOVA define control pools via \`control_dict\`.
   - After each correction, project to 2D with \`ov.utils.mde\` and visualise \`batch\` vs \`cell_type\` to check mixing and conservation.
10. **Benchmark integration performance**
    - Persist final object (\`adata.write_h5ad('neurips2021_batch_all.h5ad', compression='gzip')\`) and reload when necessary.
    - Use \`scib_metrics.benchmark.Benchmarker\` with embeddings list (\`["X_pca", "X_combat", "X_harmony", "X_cellanova", "X_scanorama", "X_mira_topic", "X_mira_feature", "X_scVI"]\`) to compute batch-vs-biology trade-offs via \`bm.benchmark()\` and summarise with \`bm.plot_results_table(min_max_scale=False)\`.
11. **General troubleshooting**
    - Ensure \`adata.raw\` captures the unscaled log-normalised matrix before subsetting to HVGs.
    - Confirm \`use_rep='scaled|original|X_pca'\` strings exist in \`adata.obsm\` prior to clustering; rerun preprocessing if missing.
    - Monitor memory when running cNMF or scVI; adjust \`n_iter\`, \`components\`, or latent dimensions for smaller datasets.
    - **Pipeline dependency errors**: When you encounter errors like "Could not find 'leiden' in adata.obs", always check and add prerequisites:
      - Before leiden/louvain clustering → ensure \`'neighbors' in adata.uns\`
      - Before plotting by clustering → ensure the cluster column exists in \`adata.obs\`
      - Before UMAP/embedding → ensure PCA or another dimensionality reduction is complete
    - **Code generation pattern**: When generating multi-step code, use defensive checks rather than assuming prior steps completed successfully. This prevents cascading failures when users run steps out of order or in separate sessions.`
    },
    {
      title: "Examples",
      content: `- "Normalise dentate gyrus cells, compare Leiden, scICE, and GMM clusters, and report ARI scores versus provided \`clusters\`."
- "Batch-correct three NeurIPS datasets with Harmony and scVI, produce MDE embeddings coloured by \`batch\` and \`cell_type\`, and benchmark the embeddings."
- "Fit topic and cNMF models on a preprocessed AnnData object, retrieve classifier-refined cluster calls, and visualise the resulting programs on UMAP."`
    },
    {
      title: "References",
      content: `- Clustering walkthrough: [\`t_cluster.ipynb\`](../../omicverse_guide/docs/Tutorials-single/t_cluster.ipynb)
- Batch integration walkthrough: [\`t_single_batch.ipynb\`](../../omicverse_guide/docs/Tutorials-single/t_single_batch.ipynb)
- Quick copy/paste commands: [\`reference.md\`](reference.md)`
    },
  ]
};

const _single_annotation: FullSkillData = {
  key: "single-annotation",
  name: "single-cell-annotation-skills-with-omicverse",
  title: "Single-cell annotation skills with omicverse",
  description: "Cell type annotation: SCSA, MetaTiME, CellVote consensus, CellMatch, GPTAnno, weighted KNN label transfer in OmicVerse.",
  sections: [
    {
      title: "Overview",
      content: `Use this skill to reproduce and adapt the single-cell annotation playbook captured in omicverse tutorials: SCSA [\`t_cellanno.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_cellanno.ipynb), MetaTiME [\`t_metatime.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_metatime.ipynb), CellVote [\`t_cellvote.md\`](../../../omicverse_guide/docs/Tutorials-single/t_cellvote.md) & [\`t_cellvote_pbmc3k.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_cellvote_pbmc3k.ipynb), CellMatch [\`t_cellmatch.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_cellmatch.ipynb), GPTAnno [\`t_gptanno.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_gptanno.ipynb), and label transfer [\`t_anno_trans.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_anno_trans.ipynb). Each section below highlights required inputs, training/inference steps, and how to read the outputs.`
    },
    {
      title: "Instructions",
      content: `1. **SCSA automated cluster annotation**
   - *Data requirements*: PBMC3k raw counts from 10x Genomics (\`pbmc3k_filtered_gene_bc_matrices.tar.gz\`) or the processed \`sample/rna.h5ad\`. Download instructions are embedded in the notebook; unpack to \`data/filtered_gene_bc_matrices/hg19/\`. Ensure an SCSA SQLite database is available (e.g. \`pySCSA_2024_v1_plus.db\` from the Figshare/Drive links listed in the tutorial) and point \`model_path\` to its location.
   - *Preprocessing & model fit*: Load with \`ov.io.read_10x_mtx\`, run QC (\`ov.pp.qc\`), normalization and HVG selection (\`ov.pp.preprocess\`), scaling (\`ov.pp.scale\`), PCA (\`ov.pp.pca\`), neighbors, Leiden clustering, and compute rank markers (\`sc.tl.rank_genes_groups\`). Instantiate \`scsa = ov.single.pySCSA(...)\` choosing \`target='cellmarker'\` or \`'panglaodb'\`, tissue scope, and thresholds (\`foldchange\`, \`pvalue\`).
   - *Inference & interpretation*: Call \`scsa.cell_anno(clustertype='leiden', result_key='scsa_celltype_cellmarker')\` or \`scsa.cell_auto_anno\` to append predictions to \`adata.obs\`. Compare to manual marker-based labels via \`ov.pl.embedding\` or \`sc.pl.dotplot\`, inspect marker dictionaries (\`ov.single.get_celltype_marker\`), and query supported tissues with \`scsa.get_model_tissue()\`. Use the ROI/ROE helpers (\`ov.utils.roe\`, \`ov.utils.plot_cellproportion\`) to validate abundance trends.

2. **MetaTiME tumour microenvironment states**
   - *Data requirements*: Batched TME AnnData with an scVI latent embedding. The tutorial uses \`TiME_adata_scvi.h5ad\` from Figshare (\`https://figshare.com/ndownloader/files/41440050\`). If starting from counts, run scVI (\`scvi.model.SCVI\`) first to populate \`adata.obsm['X_scVI']\`.
   - *Preprocessing & model fit*: Optionally subset to non-malignant cells via \`adata.obs['isTME']\`. Rebuild neighbors on the latent representation (\`sc.pp.neighbors(adata, use_rep="X_scVI")\`) and embed with umap (\`adata.obsm['X_umap'] = ov.pp.umap(...)\`). Initialise \`TiME_object = ov.single.MetaTiME(adata, mode='table')\` and, if finer granularity is desired, over-cluster with \`TiME_object.overcluster(resolution=8, clustercol='overcluster')\`.
   - *Inference & interpretation*: Run \`TiME_object.predictTiME(save_obs_name='MetaTiME')\` to assign minor states and \`Major_MetaTiME\`. Visualise using \`TiME_object.plot\` or \`sc.pl.embedding\`. Interpret the outputs by comparing cluster-level distributions and confirming that MetaTiME and Major_MetaTiME columns align with expected niches.

3. **CellVote consensus labelling**
   - *Data requirements*: A clustered AnnData (e.g. PBMC3k stored as \`CELLVOTE_PBMC3K\` env var or \`data/pbmc3k.h5ad\`) plus at least two precomputed annotation columns (simulated in the tutorial as \`scsa_annotation\`, \`gpt_celltype\`, \`gbi_celltype\`). Prepare per-cluster marker genes via \`sc.tl.rank_genes_groups\`.
   - *Preprocessing & model fit*: After standard preprocessing (normalize, log1p, HVGs, PCA, neighbors, Leiden) build a marker dictionary \`marker_dict = top_markers_from_rgg(adata, 'leiden', topn=10)\` or via \`ov.single.get_celltype_marker\`. Instantiate \`cv = ov.single.CellVote(adata)\`.
   - *Inference & interpretation*: Call \`cv.vote(clusters_key='leiden', cluster_markers=marker_dict, celltype_keys=[...], species='human', organization='PBMC', provider='openai', model='gpt-4o-mini')\`. Offline examples monkey-patch arbitration to avoid API calls; online voting requires valid credentials. Final consensus labels live in \`adata.obs['CellVote_celltype']\`. Compare each cluster’s majority vote with the input sources (\`adata.obs[['leiden', 'scsa_annotation', ...]]\`) to justify decisions.

4. **CellMatch ontology mapping**
   - *Data requirements*: Annotated AnnData such as \`pertpy.dt.haber_2017_regions()\` with \`adata.obs['cell_label']\`. Download Cell Ontology JSON (\`cl.json\`) via \`ov.single.download_cl(...)\` or manual links, and optionally Cell Taxonomy resources (\`Cell_Taxonomy_resource.txt\`). Ensure access to a SentenceTransformer model (\`sentence-transformers/all-MiniLM-L6-v2\`, \`BAAI/bge-base-en-v1.5\`, etc.), downloading to \`local_model_dir\` if offline.
   - *Preprocessing & model fit*: Create the mapper with \`ov.single.CellOntologyMapper(cl_obo_file='new_ontology/cl.json', model_name='sentence-transformers/all-MiniLM-L6-v2', local_model_dir='./my_models')\`. Run \`mapper.map_adata(...)\` to assign ontology-derived labels/IDs, optionally enabling taxonomy matching (\`use_taxonomy=True\` after calling \`load_cell_taxonomy_resource\`).
   - *Inference & interpretation*: Explore mapping summaries (\`mapper.print_mapping_summary_taxonomy\`) and inspect embeddings coloured by \`cell_ontology\`, \`cell_ontology_cl_id\`, or \`enhanced_cell_ontology\`. Use helper queries such as \`mapper.find_similar_cells('T helper cell')\`, \`mapper.get_cell_info(...)\`, and category browsing to validate ontology coverage.

5. **GPTAnno LLM-powered annotation**
   - *Data requirements*: The same PBMC3k dataset (raw matrix or \`.h5ad\`) and cluster assignments. Access to an LLM endpoint—configure \`AGI_API_KEY\` for OpenAI-compatible providers (\`provider='openai'\`, \`'qwen'\`, \`'kimi'\`, etc.), or supply a local model path for \`ov.single.gptcelltype_local\`.
   - *Preprocessing & model fit*: Follow the QC, normalization, HVG, scaling, PCA, neighbor, Leiden, and marker discovery steps described above (reusing outputs from the SCSA workflow). Build the marker dictionary automatically with \`ov.single.get_celltype_marker(adata, clustertype='leiden', rank=True, key='rank_genes_groups', foldchange=2, topgenenumber=5)\`.
   - *Inference & interpretation*: Invoke \`ov.single.gptcelltype(...)\` specifying tissue/species context and desired provider/model. Post-process responses to keep clean labels (\`result[key].split(': ')[-1]...\`) and write them to \`adata.obs['gpt_celltype']\`. Compare embeddings (\`ov.pl.embedding(..., color=['leiden','gpt_celltype'])\`) to verify cluster identities. If operating offline, call \`ov.single.gptcelltype_local\` with a downloaded instruction-tuned checkpoint.

6. **Weighted KNN annotation transfer**
   - *Data requirements*: Cross-modal GLUE outputs with aligned embeddings, e.g. \`data/analysis_lymph/rna-emb.h5ad\` (annotated RNA) and \`data/analysis_lymph/atac-emb.h5ad\` (query ATAC) where both contain \`obsm['X_glue']\`.
   - *Preprocessing & model fit*: Load both modalities, optionally concatenate for QC plots, and compute a shared low-dimensional embedding with \`ov.utils.mde\`. Train a neighbour model using \`ov.utils.weighted_knn_trainer(train_adata=rna, train_adata_emb='X_glue', n_neighbors=15)\`.
   - *Inference & interpretation*: Transfer labels via \`labels, uncert = ov.utils.weighted_knn_transfer(query_adata=atac, query_adata_emb='X_glue', label_keys='major_celltype', knn_model=knn_transformer, ref_adata_obs=rna.obs)\`. Store predictions in \`atac.obs['transf_celltype']\` and uncertainties in \`atac.obs['transf_celltype_unc']\`; copy to \`major_celltype\` if you want consistent naming. Visualise (\`ov.pl.embedding\`) and inspect uncertainty to flag ambiguous cells.`
    },
    {
      title: "Defensive Validation Patterns",
      content: `\`\`\`python
# Before SCSA: verify rank_genes_groups has been computed
assert 'rank_genes_groups' in adata.uns, \\
    "Marker genes required. Run sc.tl.rank_genes_groups(adata, groupby='leiden') first."

# Before any annotation: verify clustering exists
assert 'leiden' in adata.obs.columns or 'louvain' in adata.obs.columns, \\
    "Clustering required. Run ov.pp.leiden(adata) or sc.tl.leiden(adata) first."

# Before CellVote: verify multiple annotation columns exist
annotation_keys = ['scsa_annotation', 'gpt_celltype']  # adjust to actual keys
for key in annotation_keys:
    assert key in adata.obs.columns, f"Annotation column '{key}' not found — run annotators first"
\`\`\``
    },
    {
      title: "Critical API Reference - EXACT Function Signatures",
      content: `### pySCSA - IMPORTANT: Parameter is \`clustertype\`, NOT \`cluster\`

**CORRECT usage:**
\`\`\`python
# Step 1: Initialize pySCSA
scsa = ov.single.pySCSA(
    adata,
    foldchange=1.5,
    pvalue=0.01,
    species='Human',
    tissue='All',
    target='cellmarker'  # or 'panglaodb'
)

# Step 2: Run annotation - NOTE: use clustertype='leiden', NOT cluster='leiden'!
anno_result = scsa.cell_anno(clustertype='leiden', cluster='all')

# Step 3: Add cell type labels to adata.obs
scsa.cell_auto_anno(adata, clustertype='leiden', key='scsa_celltype')
# Results are stored in adata.obs['scsa_celltype']
\`\`\`

**WRONG - DO NOT USE:**
\`\`\`python
# WRONG! 'cluster' is NOT a valid parameter for cell_auto_anno!
# scsa.cell_auto_anno(adata, cluster='leiden')  # ERROR!
\`\`\`

### COSG Marker Genes - Results stored in adata.uns, NOT adata.obs

**CORRECT usage:**
\`\`\`python
# Step 1: Run COSG marker gene identification
ov.single.cosg(adata, groupby='leiden', n_genes_user=50)

# Step 2: Access results from adata.uns (NOT adata.obs!)
marker_names = adata.uns['rank_genes_groups']['names']  # DataFrame with cluster columns
marker_scores = adata.uns['rank_genes_groups']['scores']

# Step 3: Get top markers for specific cluster
cluster_0_markers = adata.uns['rank_genes_groups']['names']['0'][:10].tolist()

# Step 4: To create celltype column, manually map clusters to cell types
cluster_to_celltype = {
    '0': 'T cells',
    '1': 'B cells',
    '2': 'Monocytes',
}
adata.obs['cosg_celltype'] = adata.obs['leiden'].map(cluster_to_celltype)
\`\`\`

**WRONG - DO NOT USE:**
\`\`\`python
# WRONG! COSG does NOT create adata.obs columns directly!
# adata.obs['cosg_celltype']  # This key does NOT exist after running COSG!
# adata.uns['cosg_celltype']  # This key also does NOT exist!
\`\`\`

### Common Pitfalls to Avoid

1. **pySCSA parameter confusion**:
   - \`clustertype\` = which obs column contains cluster labels (e.g., 'leiden')
   - \`cluster\` = which specific clusters to annotate ('all' or specific cluster IDs)
   - These are DIFFERENT parameters!

2. **COSG result access**:
   - COSG is a marker gene finder, NOT a cell type annotator
   - Results are per-cluster gene rankings stored in \`adata.uns['rank_genes_groups']\`
   - To assign cell types, you must manually map clusters to cell types based on markers

3. **Result storage patterns in OmicVerse**:
   - Cell type annotations → \`adata.obs['<key>']\`
   - Marker gene results → \`adata.uns['<key>']\` (includes 'names', 'scores', 'logfoldchanges')
   - Differential expression → \`adata.uns['rank_genes_groups']\``
    },
    {
      title: "Examples",
      content: `- "Run SCSA with both CellMarker and PanglaoDB references on PBMC3k, then benchmark against manual marker assignments before feeding the results into CellVote."
- "Annotate tumour microenvironment states in the MetaTiME Figshare dataset, highlight Major_MetaTiME classes, and export the label distribution per patient."
- "Download Cell Ontology resources, map \`haber_2017_regions\` clusters to ontology terms, and enrich ambiguous clusters using Cell Taxonomy hints."
- "Propagate RNA-derived \`major_celltype\` labels onto GLUE-integrated ATAC cells and report clusters with high transfer uncertainty."`
    },
    {
      title: "References",
      content: `- Tutorials and notebooks: [\`t_cellanno.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_cellanno.ipynb), [\`t_metatime.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_metatime.ipynb), [\`t_cellvote.md\`](../../../omicverse_guide/docs/Tutorials-single/t_cellvote.md), [\`t_cellvote_pbmc3k.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_cellvote_pbmc3k.ipynb), [\`t_cellmatch.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_cellmatch.ipynb), [\`t_gptanno.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_gptanno.ipynb), [\`t_anno_trans.ipynb\`](../../../omicverse_guide/docs/Tutorials-single/t_anno_trans.ipynb).
- Sample data & assets: PBMC3k matrix from 10x Genomics, MetaTiME \`TiME_adata_scvi.h5ad\` (Figshare), SCSA database downloads, GLUE embeddings under \`data/analysis_lymph/\`, Cell Ontology \`cl.json\`, and Cell Taxonomy resource.
- Quick copy commands: [\`reference.md\`](reference.md).`
    },
  ]
};

const _single_popv_annotation: FullSkillData = {
  key: "single-popv-annotation",
  name: "single-popv-annotation",
  title: "PopV population-level cell type annotation",
  description: "PopV population-level cell annotation: 10 algorithms (SCVI, SCANVI, CellTypist, OnClass, RF, SVM, XGBoost, BBKNN, HARMONY, SCANORAMA), consensus voting, pretrained hub models.",
  sections: [
    {
      title: "Defensive Validation",
      content: `\`\`\`python
# Before PopV: verify reference has the cell type column
assert ref_labels_key in ref_adata.obs.columns, \\
    f"ref_adata.obs['{ref_labels_key}'] not found. Available: {list(ref_adata.obs.columns)}"

# Verify no NaN in reference labels
assert ref_adata.obs[ref_labels_key].notna().all(), \\
    f"NaN values in ref_adata.obs['{ref_labels_key}']. Use fillna() or drop these cells."

# Verify gene overlap
overlap = query_adata.var_names.intersection(ref_adata.var_names)
assert len(overlap) > 100, \\
    f"Only {len(overlap)} overlapping genes between query and reference. Check var_names format (ENSEMBL vs symbol)."
\`\`\``
    },
    {
      title: "Stage 1: Data Preparation",
      content: `\`\`\`python
import omicverse as ov

# Process_Query preprocesses and concatenates query + reference
process_obj = ov.popv.Process_Query(
    query_adata=query_adata,
    ref_adata=ref_adata,
    ref_labels_key='cell_type',           # REQUIRED: column in ref_adata.obs
    ref_batch_key='batch',                # batch column in ref_adata.obs
    query_batch_key='batch',              # batch column in query_adata.obs (optional)
    cl_obo_folder=False,                  # False to skip ontology, or path to CL .obo file
    prediction_mode='retrain',            # 'retrain' | 'inference' | 'fast'
    unknown_celltype_label='unknown',     # label for query cells
    n_samples_per_label=300,              # subsample reference per cell type
    hvg=4000,                             # number of highly variable genes
    save_path_trained_models='tmp/',      # where to save models
    pretrained_scvi_path=None,            # path to pretrained scVI model (optional)
)
\`\`\`

**prediction_mode choices:**
- \`'retrain'\` — Train all models from scratch on reference+query. Most accurate, slowest.
- \`'inference'\` — Load previously saved models. Requires \`save_path_trained_models\` from prior run.
- \`'fast'\` — Skip integration-heavy algorithms. Uses FAST_ALGORITHMS subset.

**Preprocessing applied automatically:**
- Filters cells with < 30 total counts
- Log1p normalization (target_sum=1e4)
- PCA on reference (50 components)
- Stores raw counts in \`layers['scvi_counts']\``
    },
    {
      title: "Stage 2: Annotation",
      content: `\`\`\`python
# Run all algorithms and compute consensus
ov.popv.annotate_data(
    process_obj.adata,
    methods='all',                        # or list of specific algorithms
    save_path='results/popv/',            # saves predictions.csv here
    methods_kwargs=None,                  # dict of per-method overrides
)
\`\`\`

### Available Algorithms (10 total)

| Algorithm | Result Key | Type | Speed |
|-----------|-----------|------|-------|
| \`KNN_SCVI\` | \`popv_knn_on_scvi_prediction\` | Deep learning + KNN | Medium |
| \`SCANVI_POPV\` | \`popv_scanvi_prediction\` | Semi-supervised DL | Medium |
| \`CELLTYPIST\` | \`popv_celltypist_prediction\` | Logistic regression | Fast |
| \`ONCLASS\` | \`popv_onclass_prediction\` | Ontology-guided | Medium |
| \`Support_Vector\` | \`popv_svm_prediction\` | SVM | Fast |
| \`XGboost\` | \`popv_xgboost_prediction\` | Gradient boosting | Fast |
| \`KNN_HARMONY\` | \`popv_knn_harmony_prediction\` | Harmony + KNN | Fast |
| \`KNN_BBKNN\` | \`popv_knn_bbknn_prediction\` | BBKNN + KNN | Fast |
| \`Random_Forest\` | \`popv_rf_prediction\` | Random forest | Fast |
| \`KNN_SCANORAMA\` | \`popv_knn_scanorama_prediction\` | Scanorama + KNN | Medium |

**Algorithm subsets:**
- \`FAST_ALGORITHMS\`: KNN_SCVI, SCANVI_POPV, Support_Vector, XGboost, ONCLASS, CELLTYPIST (used with \`prediction_mode='fast'\`)
- \`CURRENT_ALGORITHMS\`: All except Random_Forest and KNN_SCANORAMA (outdated)
- \`'all'\` or \`None\`: Uses CURRENT_ALGORITHMS (or FAST_ALGORITHMS in fast mode)

### Selecting Specific Methods

\`\`\`python
# Run only fast classical methods
ov.popv.annotate_data(
    process_obj.adata,
    methods=['CELLTYPIST', 'Support_Vector', 'XGboost'],
)

# Override per-method parameters
ov.popv.annotate_data(
    process_obj.adata,
    methods=['KNN_SCVI', 'SCANVI_POPV'],
    methods_kwargs={
        'KNN_SCVI': {'train_kwargs': {'max_epochs': 50}},
        'SCANVI_POPV': {'train_kwargs': {'max_epochs': 50}},
    },
)
\`\`\``
    },
    {
      title: "Stage 3: Consensus Results & Visualization",
      content: `After \`annotate_data()\`, these columns appear in \`adata.obs\`:

| Column | Description |
|--------|-------------|
| \`popv_majority_vote_prediction\` | Majority vote across all methods |
| \`popv_majority_vote_score\` | Number of agreeing methods |
| \`popv_prediction\` | Ontology-aggregated consensus (if CL enabled) |
| \`popv_prediction_score\` | Ontology consensus score |

\`\`\`python
# Agreement plots: confusion matrices per method vs consensus
ov.popv.make_agreement_plots(
    process_obj.adata,
    prediction_keys=process_obj.adata.uns['prediction_keys'],
    popv_prediction_key='popv_prediction',
    save_folder='results/popv/',
    show=True,
)

# Bar plot: agreement score per cell type
ov.popv.agreement_score_bar_plot(
    process_obj.adata,
    popv_prediction_key='popv_prediction',
    save_folder='results/popv/',
)

# Bar plot: prediction score distribution
ov.popv.prediction_score_bar_plot(
    process_obj.adata,
    popv_prediction_score='popv_prediction_score',
    save_folder='results/popv/',
)

# Bar plot: cell type proportions (ref vs query)
ov.popv.celltype_ratio_bar_plot(
    process_obj.adata,
    popv_prediction='popv_prediction',
    save_folder='results/popv/',
)
\`\`\``
    },
    {
      title: "Stage 4: Pretrained Hub Models (Optional)",
      content: `For large references (e.g., Human Cell Atlas), use pretrained models to skip training:

\`\`\`python
from omicverse.popv.hub import HubModel

# Pull pretrained model from HuggingFace
model = HubModel.pull_from_huggingface_hub(
    repo_name='popv/immune_all',
    cache_dir='models/popv/',
)

# Annotate query data directly (fast mode)
result_adata = model.annotate_data(
    query_adata=query_adata,
    query_batch_key='batch',
    prediction_mode='fast',
    methods=None,  # uses model's default methods
)
\`\`\``
    },
    {
      title: "Critical API Reference",
      content: `\`\`\`python
# CORRECT: methods as list of strings matching class names
ov.popv.annotate_data(adata, methods=['KNN_SCVI', 'CELLTYPIST', 'Support_Vector'])

# WRONG: passing class objects or lowercase names
# ov.popv.annotate_data(adata, methods=[KNN_SCVI, CELLTYPIST])  # TypeError
# ov.popv.annotate_data(adata, methods=['knn_scvi'])             # KeyError

# CORRECT: ref_labels_key must exist in ref_adata.obs before Process_Query
assert 'cell_type' in ref_adata.obs.columns
process_obj = ov.popv.Process_Query(ref_labels_key='cell_type', ...)

# WRONG: forgetting to set unknown_celltype_label causes NaN in voting
# process_obj = ov.popv.Process_Query(..., unknown_celltype_label=None)  # NaN errors

# CORRECT: access consensus results after annotation
final_labels = process_obj.adata.obs['popv_majority_vote_prediction']
# or ontology-refined:
final_labels = process_obj.adata.obs['popv_prediction']

# WRONG: looking for results on the original query_adata
# query_adata.obs['popv_prediction']  # KeyError: results are on process_obj.adata
\`\`\``
    },
    {
      title: "GPU Acceleration",
      content: `\`\`\`python
import omicverse.popv as popv
popv.settings.accelerator = 'gpu'   # for scVI/scANVI training
popv.settings.cuml = True           # for KNN/SVM/RF via cuML
popv.settings.n_jobs = 10           # parallel jobs for CPU methods
\`\`\``
    },
    {
      title: "Troubleshooting",
      content: `- **\`RuntimeError: CUDA out of memory\` during scVI/scANVI training**: Reduce \`hvg\` (try 2000), decrease \`n_samples_per_label\` (try 100), or switch to \`prediction_mode='fast'\` which uses fewer epochs.
- **CellTypist model download fails**: Set \`methods_kwargs={'CELLTYPIST': {'method_kwargs': {'model': '/path/to/local/model.pkl'}}}\` to use a local model file.
- **Low consensus agreement (<50% cells agree)**: Some algorithms may not suit your tissue. Exclude underperforming methods: check per-method predictions and drop outliers from the \`methods\` list.
- **\`KeyError: 'gene_name'\` — gene identifier mismatch**: Harmonize var_names between reference and query before calling \`Process_Query\`. Use \`adata.var_names = adata.var['gene_symbols']\` if ENSEMBL IDs are in var_names.
- **\`ValueError: batch_key contains NaN\`**: Clean batch columns before PopV. Apply the batch validation pattern from the single-preprocessing skill: \`adata.obs['batch'] = adata.obs['batch'].fillna('unknown').astype('category')\`.
- **\`FileNotFoundError\` in inference mode**: Ensure \`save_path_trained_models\` points to the same directory used during the original \`retrain\` run. Check that model files (.pt, .pkl, .joblib) exist.`
    },
    {
      title: "Dependencies",
      content: `- Core: \`omicverse\`, \`scanpy\`, \`anndata\`, \`numpy\`, \`pandas\`
- Deep learning: \`scvi-tools\`, \`torch\` (for KNN_SCVI, SCANVI_POPV)
- Classical ML: \`scikit-learn\`, \`xgboost\` (for RF, SVM, XGBoost)
- Integration: \`harmonypy\`, \`bbknn\`, \`scanorama\` (for respective KNN methods)
- Annotation: \`celltypist\`, \`OnClass\` (optional per method)
- Ontology: \`obonet\`, \`pronto\` (for ontology-aware voting)
- Hub: \`huggingface_hub\` (for pretrained models)`
    },
    {
      title: "Examples",
      content: `- "Annotate my PBMC query data against a reference atlas using PopV with all 10 algorithms and visualize the consensus."
- "Use a pretrained PopV hub model to quickly annotate my lung tissue scRNA-seq data."
- "Run PopV with only classical methods (SVM, XGBoost, CellTypist) to annotate my query cells without GPU."`
    },
    {
      title: "References",
      content: `- Quick copy/paste commands: [\`reference.md\`](reference.md)`
    },
  ]
};

const _single_trajectory: FullSkillData = {
  key: "single-trajectory",
  name: "single-trajectory-analysis",
  title: "Single-trajectory analysis",
  description: "Trajectory & RNA velocity: PAGA, Palantir, VIA, dynamo, scVelo, latentvelo, graphvelo backends via ov.single.Velo. Pseudotime, stream plots.",
  sections: [
    {
      title: "Overview",
      content: `This skill describes how to reproduce and extend the single-trajectory analysis workflow in \`omicverse\`, combining graph-based trajectory inference, RNA velocity coupling, and downstream fate scoring notebooks.`
    },
    {
      title: "Trajectory setup",
      content: `- **PAGA (Partition-based graph abstraction)**
  - Build a neighborhood graph (\`pp.neighbors\`) on the preprocessed AnnData object.
  - Use \`tl.paga\` to compute cluster connectivity and \`tl.draw_graph\` or \`tl.umap\` with \`init_pos='paga'\` for embedding.
  - Interpret edge weights to prioritize branch resolution and seed paths.
- **Palantir**
  - Run \`Palantir\` on diffusion components, seeding with manually selected start cells (e.g., naïve T cells).
  - Extract pseudotime, branch probabilities, and differentiation potential for subsequent overlays.
- **VIA**
  - Execute \`via.VIA\` on the kNN graph to identify lineage progression with automatic root selection or user-defined roots.
  - Export terminal states and pseudotime for cross-validation against PAGA and Palantir results.`
    },
    {
      title: "Velocity coupling (VIA + scVelo)",
      content: `- Use \`scv.pp.filter_and_normalize\`, \`scv.pp.moments\`, and \`scv.tl.velocity\` to generate velocity layers.
- Provide VIA with \`adata.layers['velocity']\` to refine lineage directionality (\`via.VIA(..., velocity_weight=...)\`).
- Compare VIA pseudotime with scVelo latent time (\`scv.tl.latent_time\`) to validate directionality and root selection.`
    },
    {
      title: "Advanced RNA Velocity Backends (ov.single.Velo)",
      content: `OmicVerse provides a unified \`Velo\` class wrapping 4 velocity backends. Use this when you need more than basic scVelo:

### Backend selection guide

| Backend | Best for | GPU? | Prerequisites |
|---------|----------|------|---------------|
| **scvelo** | Standard velocity analysis | No | spliced/unspliced layers |
| **dynamo** | Kinetics modeling, vector fields | No | spliced/unspliced layers |
| **latentvelo** | VAE-based, batch correction, complex dynamics | Yes (torchdiffeq) | celltype_key, batch_key optional |
| **graphvelo** | Refinement layer on top of any backend | No | base velocity + connectivities |

### Unified Velo pipeline

\`\`\`python
import omicverse as ov

velo = ov.single.Velo(adata)

# 1. Filter (scvelo backend) or preprocess (dynamo backend)
velo.filter_genes(min_shared_counts=20)     # For scvelo
# velo.preprocess(recipe='monocle', n_neighbors=30, n_pcs=30)  # For dynamo

# 2. Compute moments
velo.moments(backend='scvelo', n_pcs=30, n_neighbors=30)
# backend: 'scvelo' or 'dynamo'

# 3. Fit kinetic parameters
velo.dynamics(backend='scvelo')

# 4. Calculate velocity
velo.cal_velocity(method='scvelo')
# method: 'scvelo', 'dynamo', 'latentvelo', 'graphvelo'

# 5. Build velocity graph and project to embedding
velo.velocity_graph(basis='umap')
velo.velocity_embedding(basis='umap')
\`\`\`

### latentvelo specifics (deep learning velocity)

latentvelo uses a VAE + neural ODE to learn latent dynamics. It handles batch effects and complex trajectories better than classical scVelo:

\`\`\`python
velo.cal_velocity(
    method='latentvelo',
    celltype_key='cell_type',    # Optional: AnnotVAE uses cell type info
    batch_key='batch',           # Optional: batch correction
    velocity_key='velocity_S',
    n_top_genes=2000,
    latentvelo_VAE_kwargs={},    # Pass custom VAE hyperparameters
)
# Requires: pip install torchdiffeq
# Uses GPU if available, falls back to CPU
\`\`\`

### graphvelo specifics (refinement layer)

GraphVelo refines velocity estimates from any base method by leveraging the cell graph structure. Run it after scvelo or dynamo:

\`\`\`python
# First: compute base velocity with scvelo or dynamo
velo.cal_velocity(method='scvelo')

# Then: refine with graphvelo
velo.graphvelo(
    xkey='Ms',                          # Spliced moments key
    vkey='velocity_S',                  # Base velocity key to refine
    basis_keys=['X_umap', 'X_pca'],    # Project to multiple embeddings
    gene_subset=None,                   # Optional: restrict to gene subset
)
\`\`\``
    },
    {
      title: "Downstream fate scoring notebooks",
      content: `- **CellFateGenie**: For pseudotime-associated gene discovery, use \`search_skills('CellFateGenie fate genes')\` to load the dedicated CellFateGenie skill.
- **\`t_metacells.ipynb\`**: Aggregate metacell trajectories for robustness checks and meta-state differential expression.
- **\`t_cytotrace.ipynb\`**: Integrate CytoTRACE differentiation potential with velocity-informed lineages for maturation scoring.`
    },
    {
      title: "Required preprocessing",
      content: `1. Quality control: remove low-quality cells/genes, apply doublet filtering.
2. Normalization & log transformation (\`sc.pp.normalize_total\`, \`sc.pp.log1p\`).
3. Highly variable gene selection tailored to immune datasets (\`sc.pp.highly_variable_genes\`).
4. Batch correction if necessary (e.g., \`scvi-tools\`, \`bbknn\`).
5. Compute PCA, neighbor graph, and embedding (UMAP/FA) used by all trajectory methods.
6. For velocity: compute moments on the same neighbor graph before running VIA coupling.`
    },
    {
      title: "Parameter tuning",
      content: `- Neighbor graph \`n_neighbors\` and \`n_pcs\` should be harmonized across PAGA, VIA, and Palantir to maintain consistency.
- In VIA, adjust \`knn\`, \`too_big_factor\`, and \`root_user\` for datasets with uneven sampling.
- Palantir requires careful start cell selection; use marker genes and velocity arrows to confirm.
- For PAGA, tweak \`threshold\` to control edge sparsity; ensure connected components reflect biological branches.
- Velocity estimation: compare \`mode='stochastic'\` vs \`mode='dynamical'\` in scVelo; recalibrate if terminal states disagree with VIA.`
    },
    {
      title: "Visualization and export",
      content: `1. Overlay PAGA edges on UMAP (\`scv.pl.paga\`) and annotate branch labels.
2. Plot Palantir pseudotime and branch probabilities on embeddings.
3. Visualize VIA trajectories using \`via.plot_fates\` and \`via.plot_scatter\`.
4. Export pseudotime tables and fate probabilities to CSV for downstream notebooks.
5. Save high-resolution figures (PNG/SVG) and notebook artifacts for reproducibility.
6. Update notebooks with consistent color schemes and metadata columns before sharing.`
    },
    {
      title: "Defensive Validation Patterns",
      content: `\`\`\`python
# Before PAGA: verify neighbor graph exists
assert 'neighbors' in adata.uns, "Neighbor graph required. Run sc.pp.neighbors(adata) first."

# Before VIA velocity coupling: verify velocity layers exist
if 'velocity' not in adata.layers:
    print("WARNING: velocity layer missing. Run scv.tl.velocity(adata) first for VIA coupling.")
assert 'spliced' in adata.layers and 'unspliced' in adata.layers, \\
    "Missing spliced/unspliced layers. Check loom/H5AD import preserved velocity layers."

# Before Palantir: verify PCA/diffusion components
assert 'X_pca' in adata.obsm, "PCA required. Run ov.pp.pca(adata) first."
\`\`\``
    },
    {
      title: "Troubleshooting tips",
      content: `- **Missing velocity layers**: re-run \`scv.pp.moments\` and \`scv.tl.velocity\` ensuring \`adata.layers['spliced']\`/\`['unspliced']\` exist; verify loom/H5AD import preserved layers.
- **Disconnected PAGA graph**: inspect neighbor graph or adjust \`n_neighbors\`; confirm batch correction didn’t fragment the manifold.
- **Palantir convergence issues**: reduce diffusion components or reinitialize start cells; ensure no NaN values in data matrix.
- **VIA terminal states unstable**: increase iterations (\`cluster_graph_pruning_iter\`), or provide manual terminal state hints based on marker expression.
- **Notebook kernel memory errors**: downsample cells or precompute summaries (metacells) before rerunning.
- **latentvelo \`ImportError: torchdiffeq\`**: Install with \`pip install torchdiffeq\`. Required for neural ODE backend.
- **graphvelo returns NaN velocities**: Ensure base velocity (scvelo/dynamo) was computed first. graphvelo refines — it doesn't compute from scratch.
- **dynamo \`preprocess\` fails**: dynamo expects spliced/unspliced layers. Verify with \`'spliced' in adata.layers\`.`
    },
  ]
};

const _single_cellfate_analysis: FullSkillData = {
  key: "single-cellfate-analysis",
  name: "cellfate-pseudotime-gene-analysis",
  title: "CellFateGenie pseudotime gene analysis",
  description: "CellFateGenie: Adaptive Threshold Regression for pseudotime-associated gene discovery, Mellon density, lineage scoring via ov.single.Fate.",
  sections: [
    {
      title: "Overview",
      content: `CellFateGenie answers: "Which genes change most significantly along pseudotime, and which are specifically driving a particular lineage?" It works in two phases:

1. **Gene selection** — Adaptive Threshold Regression (ATR) iteratively removes low-coefficient genes while monitoring R² to find the minimal gene set that explains pseudotime
2. **Lineage scoring** — Mellon density estimation on the manifold identifies low-density transition regions, and lineage-specific variability scoring pinpoints fate-driving genes`
    },
    {
      title: "Prerequisites",
      content: `- **Pseudotime**: Must exist as a column in \`adata.obs\`. Compute first using Palantir, VIA, DPT, or any trajectory method.
- **Mellon** (optional but important): \`pip install mellon\` for density estimation. Without it, \`low_density()\` will fail.
- **Expression data**: Works on the \`.X\` matrix. Log-normalized data is fine (unlike SCENIC which needs raw counts).`
    },
    {
      title: "Pipeline Steps",
      content: `### 1. Initialize Fate object

\`\`\`python
import omicverse as ov

# pseudotime: column name in adata.obs containing pseudotime values
fate = ov.single.Fate(adata, pseudotime='dpt_pseudotime')
# Automatically uses GPU (PyTorchRidge) if CUDA available, else sklearn Ridge on CPU
\`\`\`

### 2. Initial ridge regression (model_init)

\`\`\`python
coef_df = fate.model_init(
    test_size=0.3,           # Train/test split ratio
    alpha=0.1,               # Ridge regularization strength
    use_data_augmentation=False,  # Enable for noisy pseudotime
)
# Returns: DataFrame of gene coefficients
# Stores: fate.coef (all coefficients), fate.raw_r2, fate.raw_mse
\`\`\`

### 3. Adaptive Threshold Regression (ATR) — feature selection

This is the core innovation. ATR iteratively removes genes with the smallest coefficients and monitors when R² starts dropping significantly:

\`\`\`python
threshold_df = fate.ATR(
    test_size=0.4,
    alpha=0.1,
    stop=500,    # Maximum iterations. Increase for more genes (default 100).
    flux=0.01,   # R² drop tolerance. When R² drops by more than flux from max, stop.
)
# Sets fate.coef_threshold internally
# Visualize the filtering curve:
fate.plot_filtering()  # Shows R² vs iteration, marks optimal threshold
\`\`\`

### 4. Refit on selected genes (model_fit)

\`\`\`python
filter_coef_df = fate.model_fit(
    test_size=0.3,
    alpha=0.1,
)
# Returns: DataFrame of coefficients for genes above threshold only
# Stores: fate.filter_coef
# Compare: fate.get_r2('raw') vs fate.get_r2('filter') — filter R² should be close to raw
\`\`\`

### 5. Statistical validation (kendalltau_filter)

\`\`\`python
kendall_df = fate.kendalltau_filter()
# Computes Kendall's tau rank correlation for each filtered gene vs pseudotime
# Returns: DataFrame with kendalltau_sta and pvalue per gene
# Confirms monotonic relationship — genes with high |tau| are truly pseudotime-associated
\`\`\`

### 6. Mellon density estimation (low_density)

\`\`\`python
fate.low_density(
    n_components=10,     # Diffusion map components for manifold representation
    knn=30,              # k-nearest neighbors for density estimation
    alpha=0.0,           # Mellon regularization
    seed=0,
    pca_key='X_pca',     # PCA embedding to use
)
# Stores: adata.obs['mellon_log_density_lowd']
# Low-density regions = developmental transition points (branching, commitment)
\`\`\`

### 7. Lineage-specific scoring (lineage_score)

\`\`\`python
fate.lineage_score(
    cluster_key='leiden',              # Clustering column in adata.obs
    lineage=['20', '17'],              # Cluster labels defining the lineage of interest
    cell_mask='specification',         # How to select cells: 'specification' uses lineage list
    density_key='mellon_log_density_lowd',
)
# Stores: adata.var['change_scores_lineage']
# High scores = genes with high expression variability specifically in that lineage
\`\`\`

### 8. Identify fate-driving genes

\`\`\`python
# Intersect ATR-selected genes with lineage-specific scores
fate_genes = adata.var.loc[fate.filter_coef.index, 'change_scores_lineage']
top_fate_genes = fate_genes.sort_values(ascending=False).head(20)
print(top_fate_genes)
\`\`\``
    },
    {
      title: "Data Augmentation",
      content: `For noisy pseudotime estimates, enable augmentation to improve robustness:

\`\`\`python
fate.model_init(
    use_data_augmentation=True,
    augmentation_strategy='jitter_pseudotime_noise',  # or 'gene_expression_noise', 'both'
    augmentation_intensity=0.05,  # Noise magnitude (fraction of range)
)
# Same parameters available in ATR() and model_fit()
\`\`\``
    },
    {
      title: "ATAC Mode",
      content: `CellFateGenie also works with scATAC-seq data:

\`\`\`python
fate.atac_init(...)          # Initialize for ATAC peak data
fate.get_related_peak(...)   # Find peaks associated with fate genes
\`\`\``
    },
    {
      title: "Visualization",
      content: `\`\`\`python
# ATR filtering curve — shows R² vs iteration
fate.plot_filtering(figsize=(3, 3))

# Model fit quality
fate.plot_fitting(type='raw')     # All genes
fate.plot_fitting(type='filter')  # ATR-selected genes only

# Color-coded by cluster
fate.plot_color_fitting(type='filter', cluster_key='leiden')
\`\`\``
    },
    {
      title: "Critical API Reference",
      content: `### Pseudotime column must exist in adata.obs

\`\`\`python
# CORRECT
fate = ov.single.Fate(adata, pseudotime='dpt_pseudotime')

# WRONG — column doesn't exist
# fate = ov.single.Fate(adata, pseudotime='pseudotime')  # KeyError if not in adata.obs
\`\`\`

### ATR flux controls sensitivity

The \`flux\` parameter (default 0.01) determines when ATR stops removing genes. Lower flux = more genes retained (stricter R² preservation). Higher flux = fewer genes (more aggressive filtering).

### low_density requires mellon package

\`\`\`python
# WRONG — mellon not installed
# fate.low_density()  # ImportError: No module named 'mellon'

# FIX
# pip install mellon
\`\`\``
    },
    {
      title: "Defensive Validation Patterns",
      content: `\`\`\`python
# Verify pseudotime column exists
assert pseudotime_col in adata.obs.columns, \\
    f"Pseudotime column '{pseudotime_col}' not in adata.obs. Compute trajectory first."

# Verify pseudotime has valid values (no NaN)
import numpy as np
assert not adata.obs[pseudotime_col].isna().any(), \\
    f"Pseudotime column contains NaN. Filter cells or impute missing values."

# Verify mellon is installed (before low_density)
try:
    import mellon
except ImportError:
    print("WARNING: mellon not installed. Run: pip install mellon")

# Verify PCA exists (needed for low_density)
assert 'X_pca' in adata.obsm, "PCA required for low_density(). Run ov.pp.pca(adata) first."

# Verify lineage clusters exist (before lineage_score)
for cl in lineage_list:
    assert cl in adata.obs[cluster_key].values, \\
        f"Cluster '{cl}' not found in adata.obs['{cluster_key}']. Available: {adata.obs[cluster_key].unique()}"
\`\`\``
    },
    {
      title: "Troubleshooting",
      content: `- **\`KeyError\` on pseudotime column**: The column name passed to \`Fate()\` doesn't exist in \`adata.obs\`. Check with \`adata.obs.columns.tolist()\`.
- **\`ImportError: No module named 'mellon'\`**: Install with \`pip install mellon\`. This is required for \`low_density()\` but not for ATR/model_fit.
- **Low R² after ATR (<0.3)**: Pseudotime may not be well-correlated with gene expression. Try a different trajectory method or increase \`stop\` iterations.
- **\`plot_filtering()\` shows flat curve**: The dataset may have too few variable genes. Ensure HVG selection was done before CellFateGenie.
- **GPU out of memory**: CellFateGenie uses PyTorchRidge when CUDA is available. For large datasets, it falls back to CPU automatically, but you can force CPU by setting \`CUDA_VISIBLE_DEVICES=""\`.
- **\`lineage_score\` returns all zeros**: The specified lineage clusters may have too few cells. Check cluster sizes with \`adata.obs[cluster_key].value_counts()\`.`
    },
    {
      title: "Examples",
      content: `- "Find genes driving erythroid differentiation along my Palantir pseudotime."
- "Run CellFateGenie to identify fate-associated genes and plot the ATR filtering curve."
- "Score lineage-specific genes for the monocyte branch in my trajectory."`
    },
    {
      title: "References",
      content: `- Tutorials: \`t_cellfate.ipynb\`, \`t_cellfate_gene.ipynb\`, \`t_cellfate_genesets.ipynb\`
- Quick copy/paste commands: [\`reference.md\`](reference.md)`
    },
  ]
};

const _single_cellphone_db: FullSkillData = {
  key: "single-cellphone-db",
  name: "single-cell-cellphonedb-communication-mapping",
  title: "Single-cell CellPhoneDB communication mapping",
  description: "CellPhoneDB v5 ligand-receptor analysis, CellChatViz plots, and the newer ccc_heatmap / ccc_network_plot / ccc_stat_plot communication visualizations in OmicVerse.",
  sections: [
    {
      title: "Overview",
      content: `Apply this skill when a user wants to quantify ligand-receptor communication between annotated single-cell populations and visualize the result with OmicVerse's CellPhoneDB plotting stack. This skill now covers both the original low-level \`ov.pl.CellChatViz\` workflow and the newer public plotting APIs:

- \`ov.pl.ccc_heatmap(...)\`
- \`ov.pl.ccc_network_plot(...)\`
- \`ov.pl.ccc_stat_plot(...)\`

Use the \`ccc_*\` functions by default when the goal is to quickly generate publication-ready plots with a stable public API. Drop down to \`CellChatViz\` when the user needs method-level control or wants to combine several custom visualizations in one notebook.`
    },
    {
      title: "Instructions",
      content: `1. **Prepare the environment**
   - Use an environment with \`omicverse>=0.2\`, \`scanpy\`, \`anndata\`, \`pandas\`, \`matplotlib\`, \`seaborn\`, and CellPhoneDB resources.
   - For the newer visualizations, also ensure these optional plotting dependencies are available when needed:
     - \`marsilea\` for heatmap and bubble matrix plotters.
     - \`mpl-chord-diagram\` for chord diagrams.
     - \`networkx\` for diffusion and network-style plots.
     - \`adjustText\` if the user wants improved automatic label repulsion.
   - Activate OmicVerse plotting defaults with \`ov.plot_set()\`.
2. **Load and validate the annotated AnnData**
   - Read the normalized expression matrix with \`ov.read(...)\`.
   - Keep the communication grouping column clean, categorical, and aligned with the intended identities.
   - Recommended checks:
     \`\`\`python
     celltype_key = "cell_labels"
     assert celltype_key in adata.obs.columns, f"{celltype_key} missing from adata.obs"
     adata.obs[celltype_key] = adata.obs[celltype_key].astype("category").cat.remove_unused_categories()
     assert not adata.obs[celltype_key].isna().any(), f"NaN values found in {celltype_key}"
     min_per_group = adata.obs[celltype_key].value_counts().min()
     if min_per_group < 10:
         print(f"WARNING: smallest group has {min_per_group} cells; sparse groups may destabilize permutations")
     \`\`\`
   - Confirm the matrix is log-normalized before running CellPhoneDB. Raw counts can distort permutation-based significance.
3. **Run CellPhoneDB through OmicVerse**
   - Use \`ov.single.run_cellphonedb_v5(...)\` and persist the outputs:
     \`\`\`python
     cpdb_results, adata_cpdb = ov.single.run_cellphonedb_v5(
         adata,
         cpdb_file_path="./cellphonedb.zip",
         celltype_key="cell_labels",
         min_cell_fraction=0.005,
         min_genes=200,
         min_cells=3,
         iterations=1000,
         threshold=0.1,
         pvalue=0.05,
         threads=10,
         output_dir="./cpdb_results",
         cleanup_temp=True,
     )
     \`\`\`
   - Save \`cpdb_results\` and \`adata_cpdb\` so downstream plotting can be repeated without rerunning permutations.
4. **Prefer the new public plotting APIs for standard visualization requests**
   - Use \`ov.pl.ccc_heatmap(...)\` for matrix-like plots:
     - \`plot_type="heatmap"\` for aggregated pathway-level communication.
     - \`plot_type="focused_heatmap"\` to highlight stronger interactions after thresholding weak entries.
     - \`plot_type="dot"\` or \`"bubble"\` for interaction-level summaries.
     - \`plot_type="pathway_bubble"\` for pathway-focused Marsilea bubble summaries.
     - \`plot_type="bubble_lr"\` for ligand-receptor-pair-specific bubble matrices.
     - \`plot_type="role_heatmap"\`, \`"role_network"\`, or \`"role_network_marsilea"\` for signaling role summaries.
     - \`plot_type="diff_heatmap"\` when comparing two communication AnnData objects.
   - Use \`ov.pl.ccc_network_plot(...)\` for graph-like plots:
     - \`plot_type="circle"\` or \`"circle_focused"\` for global communication networks.
     - \`plot_type="individual_outgoing"\` / \`"individual_incoming"\` for sender- or receiver-centric circle panels.
     - \`plot_type="individual"\` for a single pathway and optionally a selected L-R pair.
     - \`plot_type="chord"\` for cell-type-level pathway chords.
     - \`plot_type="gene_chord"\` for gene-level chord diagrams across pathway-specific ligand and receptor nodes.
     - \`plot_type="lr_chord"\` for specified ligand-receptor pairs.
     - \`plot_type="diffusion"\` for pathway similarity and diffusion-style network structure.
     - \`plot_type="diff_network"\` when comparing two communication objects.
     - \`plot_type="bipartite"\`, \`"arrow"\`, \`"sigmoid"\`, or \`"embedding_network"\` for alternative layouts.
   - Use \`ov.pl.ccc_stat_plot(...)\` for statistics and summary panels:
     - \`plot_type="pathway_summary"\` to rank pathways by communication strength and significance.
     - \`plot_type="lr_contribution"\` to show the dominant ligand-receptor pairs within a pathway.
     - \`plot_type="scatter"\` or \`"role_scatter"\` to compare outgoing versus incoming signaling roles.
     - \`plot_type="role_network"\` or \`"role_network_marsilea"\` for matrix-style role summaries.
     - \`plot_type="sankey"\` for communication flow summaries.
5. **Use \`CellChatViz\` directly when the user needs method-level control**
   - Create a stable palette mapping from cell labels:
     \`\`\`python
     color_dict = dict(zip(
         adata.obs["cell_labels"].cat.categories,
         adata.uns["cell_labels_colors"]
     ))
     viz = ov.pl.CellChatViz(adata_cpdb, palette=color_dict)
     \`\`\`
   - Recommended direct workflow:
     - \`viz.compute_aggregated_network(...)\` then \`viz.netVisual_circle(...)\`.
     - \`viz.compute_pathway_communication(...)\` then \`viz.get_significant_pathways_v2(...)\`.
     - \`viz.netVisual_heatmap_marsilea(...)\` or \`viz.netVisual_heatmap_marsilea_focused(...)\`.
     - \`viz.netVisual_bubble_marsilea(...)\` for pathway bubbles.
     - \`viz.netVisual_bubble_lr(...)\` for selected ligand-receptor pairs.
     - \`viz.netVisual_chord_cell(...)\`, \`viz.netVisual_chord_gene(...)\`, and \`viz.netVisual_chord_LR(...)\`.
     - \`viz.netVisual_individual(...)\` for one pathway / one enriched pair.
     - \`viz.netAnalysis_computeCentrality()\` followed by role heatmap, scatter, and network plots.
     - \`viz.netAnalysis_contribution(pathway)\` for pathway-level pair contribution analysis.
     - \`viz.netVisual_diffusion(...)\` for pathway similarity structure.
6. **Highlight the new visualization capabilities clearly**
   - The newer additions worth surfacing in answers are:
     - \`gene_chord\`: gene-level chord diagrams, not just cell-type-level chords.
     - \`bubble_lr\`: Marsilea bubble summaries centered on explicit ligand-receptor pairs.
     - \`focused_heatmap\`: thresholded pathway heatmaps that suppress weak interactions.
     - \`role_network_marsilea\`: richer role summaries with dendrograms, color bars, and importance bars.
     - \`diffusion\`: pathway similarity network based on communication patterns.
     - \`pathway_summary\` and \`lr_contribution\`: higher-level summary/statistical views for prioritization.
   - When the user says "new visualization", prioritize demonstrating one of these rather than only the legacy circle plot.
7. **Parameter tips for the newer plots**
   - For pathway bubbles:
     - \`group_pathways=True\` groups by pathway rather than individual L-R pairs.
     - \`transpose=True\` is useful when too many cell-pair rows make labels unreadable.
     - \`add_violin=True\` can expose score distributions but makes figures denser.
   - For ligand-receptor bubbles:
     - \`show_all_pairs=True\` is useful when the user wants to compare a fixed panel of pairs even if some are weak or absent.
     - \`pair_lr_use\` or \`interaction_use\` should match the pair naming in \`adata.var\`.
   - For gene chords:
     - Require \`adata.var["gene_a"]\` and \`adata.var["gene_b"]\`.
     - Use \`rotate_names=True\` when genes or cell-type labels are long.
   - For focused heatmaps and focused circle plots:
     - Tune \`min_interaction_threshold\` to remove weak edges before plotting.
   - For role plots:
     - Run \`viz.netAnalysis_computeCentrality()\` first when using the low-level API.
     - Use \`pattern="incoming"\` and \`pattern="outgoing"\` separately if the user wants interpretable sender vs receiver programs.
8. **Troubleshooting**
   - **Metadata alignment**: the communication grouping column must be categorical and free of missing values.
   - **Database bundle**: \`cpdb_file_path\` must point to a valid CellPhoneDB v5 SQLite zip.
   - **Sparse groups**: very small sender or receiver groups often cause unstable or empty outputs.
   - **Missing columns in \`adata.var\`**:
     - \`classification\` is needed for pathway-filtered plotting.
     - \`gene_a\` and \`gene_b\` are needed for gene-level or ligand-receptor-specific plots.
   - **Optional dependency errors**:
     - install \`marsilea\` for \`pathway_bubble\`, \`bubble_lr\`, focused heatmaps, and role-network Marsilea views.
     - install \`mpl-chord-diagram\` for chord plots.
     - install \`adjustText\` if label overlap is severe.
   - **Palette mismatches**: rebuild the palette from sorted categories in \`adata.obs[celltype_key].cat.categories\` and the corresponding \`adata.uns[f"{celltype_key}_colors"]\`.`
    },
    {
      title: "Examples",
      content: `- "Run CellPhoneDB and then use \`ov.pl.ccc_heatmap(..., plot_type='focused_heatmap')\` to show the strongest pathways."
- "Create a gene-level chord diagram for FGF signaling with \`ov.pl.ccc_network_plot(..., plot_type='gene_chord')\`."
- "Compare selected ligand-receptor pairs across sender-receiver combinations with \`plot_type='bubble_lr'\`."
- "Summarize the top pathways and then rank within-pathway ligand-receptor contributions with \`ccc_stat_plot(..., plot_type='pathway_summary')\` and \`plot_type='lr_contribution'\`."
- "Use \`CellChatViz\` directly to compute centrality and render Marsilea role-network plots."`
    },
    {
      title: "References",
      content: `- Tutorial notebook: [\`t_cellphonedb.ipynb\`](../../omicverse_guide/docs/Tutorials-single/t_cellphonedb.ipynb)
- Example data: [\`omicverse_guide/docs/Tutorials-single/data/cpdb/\`](../../omicverse_guide/docs/Tutorials-single/data/cpdb/)
- Quick copy/paste commands: [\`reference.md\`](reference.md)`
    },
  ]
};

const _single_scenic_grn: FullSkillData = {
  key: "single-scenic-grn",
  name: "scenic-gene-regulatory-network",
  title: "SCENIC gene regulatory network",
  description: "SCENIC gene regulatory network: RegDiffusion GRN inference, cisTarget regulon pruning, AUCell scoring, RSS, regulon embeddings in OmicVerse.",
  sections: [
    {
      title: "Overview: 3-Stage Pipeline",
      content: `1. **GRN inference** — Predict TF → target gene links using RegDiffusion (deep learning, 10x faster than legacy GRNBoost2)
2. **Regulon pruning** — Validate links with cisTarget motif enrichment databases, keeping only direct targets
3. **AUCell scoring** — Quantify regulon activity per cell, enabling regulon-based clustering and cell type characterization`
    },
    {
      title: "Prerequisites",
      content: `### Data requirements
- **Raw counts** (NOT log-transformed). RegDiffusion needs count-level variance structure.
- HVG-filtered to ~3000 genes for tractable runtime.
- Cell type annotations in \`adata.obs\` (for downstream RSS analysis).

### Database downloads (CRITICAL — most common failure point)

cisTarget ranking databases and motif annotations must be downloaded before analysis. These are species-specific and ~1-2 GB each.

**Mouse (mm10)**:
\`\`\`bash
mkdir -p scenic_db
# Ranking databases (two resolution variants)
wget -P scenic_db/ https://resources.aertslab.org/cistarget/databases/mus_musculus/mm10/refseq_r80/mc_v10_clust/gene_based/mm10_500bp_up_100bp_down_full_tx_v10_clust.genes_vs_motifs.rankings.feather
wget -P scenic_db/ https://resources.aertslab.org/cistarget/databases/mus_musculus/mm10/refseq_r80/mc_v10_clust/gene_based/mm10_10kbp_up_10kbp_down_full_tx_v10_clust.genes_vs_motifs.rankings.feather
# Motif annotations
wget -P scenic_db/ https://resources.aertslab.org/cistarget/motif2tf/motifs-v10nr_clust-nr.mgi-m0.001-o0.0.tbl
\`\`\`

**Human (hg38)**:
\`\`\`bash
mkdir -p scenic_db
wget -P scenic_db/ https://resources.aertslab.org/cistarget/databases/homo_sapiens/hg38/refseq_r80/mc_v10_clust/gene_based/hg38_500bp_up_100bp_down_full_tx_v10_clust.genes_vs_motifs.rankings.feather
wget -P scenic_db/ https://resources.aertslab.org/cistarget/databases/homo_sapiens/hg38/refseq_r80/mc_v10_clust/gene_based/hg38_10kbp_up_10kbp_down_full_tx_v10_clust.genes_vs_motifs.rankings.feather
wget -P scenic_db/ https://resources.aertslab.org/cistarget/motif2tf/motifs-v10nr_clust-nr.hgnc-m0.001-o0.0.tbl
\`\`\``
    },
    {
      title: "Pipeline Steps",
      content: `### 1. Initialize SCENIC

\`\`\`python
import omicverse as ov
import glob

db_glob = 'scenic_db/*.feather'       # Glob pattern matching ranking DBs
motif_path = 'scenic_db/motifs-*.tbl' # Path to motif annotation file
# n_jobs: CPU workers for parallel processing. Match to available cores.
scenic = ov.single.SCENIC(adata, db_glob=db_glob, motif_path=motif_path, n_jobs=8)
\`\`\`

### 2. GRN inference with RegDiffusion

\`\`\`python
edgelist = scenic.cal_grn(method='regdiffusion', layer='counts')
# method: 'regdiffusion' (recommended, deep learning) or legacy methods
# layer: must contain RAW counts — not log-normalized. Use 'counts', 'raw_count', or 'X' if X has raw counts.
# Returns: DataFrame with columns [TF, target, importance]
\`\`\`

### 3. Regulon discovery and AUCell scoring

\`\`\`python
regulon_ad = scenic.cal_regulons(rho_mask_dropouts=True, seed=42)
# rho_mask_dropouts: ignore zero entries in correlation (handles dropout noise)
# Internally: builds co-expression modules → cisTarget motif pruning → AUCell activity scoring
# Typical compression: ~10k modules → ~70 regulons
\`\`\`

After this step, \`scenic\` stores:
- \`scenic.adjacencies\` — TF→target edge list with importance scores
- \`scenic.regulons\` — list of Regulon objects (TF, target genes, weights)
- \`scenic.auc_mtx\` — cells × regulons activity matrix (AUCell scores)
- \`scenic.modules\` — raw co-expression modules before pruning

### 4. Downstream analysis

**Regulon Specificity Scores (RSS)** — identify master regulators per cell type:
\`\`\`python
from pyscenic.utils import modules_to_regulons
from pyscenic.binarize import binarize
rss = ov.single.regulon_specificity_scores(scenic.auc_mtx, adata.obs['cell_type'])
# Returns: (cell_types × regulons) DataFrame, Jensen-Shannon divergence scores (0-1)
# Higher = more specific to that cell type
\`\`\`

**Binary activity matrix** — convert continuous AUCell to on/off:
\`\`\`python
binary_mtx, thresholds = binarize(scenic.auc_mtx, num_workers=8)
\`\`\`

**Visualization**:
\`\`\`python
# Regulon activity on embedding
ov.pl.embedding(regulon_ad, basis='X_umap', color=['Ets1(+)', 'E2f8(+)'])

# GRN network graph
ov.single.plot_grn(G, pos, tf_list, temporal_df, tf_gene_dict, top_tf_target_num=5)
\`\`\``
    },
    {
      title: "Critical API Reference",
      content: `### \`db_glob\` must be a glob pattern matching .feather files

\`\`\`python
# CORRECT — glob pattern
scenic = ov.single.SCENIC(adata, db_glob='scenic_db/*.feather', motif_path='scenic_db/motifs-v10nr_clust-nr.mgi-m0.001-o0.0.tbl', n_jobs=8)

# WRONG — single file path (needs at least one .feather match)
# scenic = ov.single.SCENIC(adata, db_glob='scenic_db/mm10_500bp.feather', ...)  # May work but misses second DB
\`\`\`

### \`layer\` in cal_grn must contain RAW counts

\`\`\`python
# CORRECT — specify raw count layer
edgelist = scenic.cal_grn(layer='counts')      # If raw counts in adata.layers['counts']
edgelist = scenic.cal_grn(layer='raw_count')   # Alternative layer name

# WRONG — using log-normalized data
# edgelist = scenic.cal_grn(layer='X')  # If X is log-normalized, GRN inference quality degrades severely
\`\`\`

### Gene names must match the species database

Mouse databases expect mixed-case gene symbols (e.g., \`Tp53\`, \`Cd4\`). Human databases expect uppercase (e.g., \`TP53\`, \`CD4\`). A mismatch → most genes unmatched → very few regulons recovered.`
    },
    {
      title: "Defensive Validation Patterns",
      content: `\`\`\`python
import os, glob as gl

# Verify cisTarget databases exist
db_files = gl.glob(db_glob)
assert len(db_files) >= 1, f"No cisTarget .feather files found matching '{db_glob}'. Download databases first."

# Verify motif annotation file exists
assert os.path.isfile(motif_path), f"Motif file not found: {motif_path}. Download species-specific .tbl file."

# Verify raw counts (not log-transformed)
import numpy as np
if hasattr(adata.X, 'toarray'):
    max_val = adata.X.toarray().max()
else:
    max_val = adata.X.max()
if max_val < 20:
    print("WARNING: Max expression value is low — data may be log-transformed. SCENIC needs raw counts.")

# Verify gene name format matches database species
sample_genes = list(adata.var_names[:5])
if 'mm10' in db_glob or 'mgi' in motif_path:
    # Mouse DB expects mixed-case (Tp53)
    if all(g.isupper() for g in sample_genes):
        print("WARNING: Gene names are all uppercase but using mouse database. Check gene name format.")
elif 'hg38' in db_glob or 'hgnc' in motif_path:
    # Human DB expects uppercase (TP53)
    if any(g[0].isupper() and g[1:].islower() for g in sample_genes if len(g) > 1):
        print("WARNING: Gene names look like mouse format but using human database.")
\`\`\``
    },
    {
      title: "Troubleshooting",
      content: `- **\`No ranking databases found\`**: The \`db_glob\` pattern doesn't match any \`.feather\` files. Check the path and ensure databases are downloaded. Use \`glob.glob(db_glob)\` to debug.
- **\`Empty regulons (0 regulons after pruning)\`**: Usually means gene names don't match the database species. Mouse genes are mixed-case (Actb), human are uppercase (ACTB). Also check: are you using raw counts?
- **\`Log-transformed data passed to RegDiffusion\`**: RegDiffusion needs variance structure from raw counts. If \`adata.X.max() < 20\`, the data is likely log-transformed. Use \`adata.layers['counts']\` or expm1 to recover raw counts.
- **\`MemoryError during regulon pruning\`**: cisTarget enrichment is memory-intensive. Reduce HVG count (2000 instead of 3000) or increase swap. Also try reducing \`n_jobs\`.
- **\`Low regulon recovery rate (10k modules → <10 regulons)\`**: Pruning thresholds may be too strict. Adjust \`cal_regulons(thresholds=(0.5, 0.75))\` for more permissive filtering. Or increase \`top_n_targets=(100,)\`.
- **\`GUROBI license required\` (CEFCON only)**: CEFCON's integer linear programming prefers GUROBI (academic license free). Fallback to SCIP is slower but works without license.`
    },
    {
      title: "Examples",
      content: `- "Run SCENIC on my mouse hematopoiesis data to find master regulators per cell type."
- "Infer gene regulatory networks from scRNA-seq and visualize TF-target relationships."
- "Score regulon activity per cell and identify cell-type-specific transcription factors."`
    },
    {
      title: "References",
      content: `- Tutorial: \`t_scenic.ipynb\`
- Quick copy/paste commands: [\`reference.md\`](reference.md)`
    },
  ]
};

const _single_downstream_analysis: FullSkillData = {
  key: "single-downstream-analysis",
  name: "single-cell-downstream-analysis",
  title: "Single-cell downstream analysis",
  description: "AUCell pathway scoring, metacell DEG, scDrug response, SCENIC regulons, cNMF programs, and NOCD community detection in OmicVerse.",
  sections: [
    {
      title: "Defensive Validation Patterns",
      content: `Before running any downstream module, verify prerequisites:

\`\`\`python
# Before AUCell: verify embeddings exist
assert 'X_umap' in adata.obsm or 'X_pca' in adata.obsm, \\
    "Embedding required. Run ov.pp.umap(adata) or ov.pp.pca(adata) first."

# Before metacell DEG: verify raw counts are preserved
assert adata.raw is not None, "adata.raw required. Set adata.raw = adata.copy() before HVG filtering."

# Before SCENIC: verify raw counts (not log-transformed) are available
if hasattr(adata.X, 'max') and adata.X.max() < 20:
    print("WARNING: SCENIC expects raw counts. Data may be log-transformed.")

# Before scDrug: verify tumor annotations
# assert 'cell_type' in adata.obs.columns, "Cell type annotation required for scDrug"
\`\`\``
    },
    {
      title: "AUCell pathway scoring (`t_aucell.ipynb`)",
      content: `- **Prerequisites**
  - Download pathway collections (GO, KEGG, or custom) that match the organism under study before running the tutorial.
  - Ensure an \`AnnData\` object with clustering/embedding (\`adata.obsm['X_umap']\`) is prepared.
- **Core calls**
  - \`ov.single.geneset_aucell\` for one pathway; \`ov.single.pathway_aucell\` for multiple pathways.
  - \`ov.single.pathway_aucell_enrichment\` to score all pathways in a library (set \`num_workers\` for parallelism).
- **Result checks**
  - Interpret AUCell scores as expression-like values (0–1). Use \`sc.pl.embedding\` to confirm pathway activity patterns.
  - Run \`sc.tl.rank_genes_groups\` on the AUCell \`AnnData\` to find cluster-enriched pathways and visualize with
    \`sc.pl.rank_genes_groups_dotplot\`.
- **Resources**
  - Library-wide scoring can be CPU-intensive; allocate workers (\`num_workers=8\` in tutorial) and sufficient memory for the
    dense AUCell matrix.
- **Optional validation / exports**
  - Persist scores with \`adata_aucs.write_h5ad('...')\` for reuse.
  - Plot enriched pathways via \`ov.single.pathway_enrichment\` and \`ov.single.pathway_enrichment_plot\` heatmaps.`
    },
    {
      title: "scRNA-seq DEG (bulk-style meta cell) (`t_scdeg.ipynb`)",
      content: `- **Prerequisites**
  - Run quality control and preprocessing (\`ov.pp.qc\`, \`ov.pp.preprocess\`, \`ov.pp.scale\`, \`ov.pp.pca\`).
  - Retain raw counts in \`adata.raw\` before HVG filtering.
- **Core calls**
  - Construct differential objects with \`ov.bulk.pyDEG(test_adata.to_df(...).T)\` for full-cell and metacell views.
  - Build metacells via \`ov.single.MetaCell(..., use_gpu=True)\` when GPU is available for acceleration.
- **Result checks**
  - Inspect volcano plots (\`dds.plot_volcano\`) and targeted boxplots (\`dds.plot_boxplot\`) for top DEGs.
  - Map DEG markers back to UMAP embeddings using \`ov.pl.embedding\` to confirm localization.
- **Resources**
  - Metacell construction benefits from GPU but can fall back to CPU; ensure enough memory for transposed dense matrices
    passed to \`pyDEG\`.
- **Optional validation / exports**
  - Save metacell embeddings with matplotlib figures; adjust \`legend_*\` settings for publication-ready visuals.`
    },
    {
      title: "scRNA-seq DEG (cell-type & composition) (`t_deg_single.ipynb`)",
      content: `- **Prerequisites**
  - Annotated \`adata\` with \`condition\`, \`cell_label\`, and optional \`batch\` metadata.
  - Initialize mixed CPU/GPU resources when using graph-based DA methods (\`ov.settings.cpu_gpu_mixed_init()\`).
- **Core calls**
  - \`ov.single.DEG(..., method='wilcoxon'|'t-test'|'memento-de')\` with \`deg_obj.run(...)\` to target cell types.
  - \`ov.single.DCT(..., method='sccoda'|'milo')\` for differential composition testing.
  - Graph setup for Milo: \`ov.pp.preprocess\`, \`ov.single.batch_correction\`, \`ov.pp.neighbors\`, \`ov.pp.umap\`.
- **Result checks**
  - Review DEG tables from \`deg_obj\` (Wilcoxon / memento) and adjust capture rate / bootstraps for stability.
  - For scCODA, tune FDR via \`sim_results.set_fdr()\`; interpret boxplots with condition-level shifts.
  - Milo diagnostics: histogram of P-values, logFC vs –log10 FDR scatter, beeswarm of differential abundance.
- **Resources**
  - Memento and Milo require multiple CPUs (\`num_cpus\`, \`num_boot\`, high \`k\`); ensure adequate compute time.
  - Harmony/scVI batch correction needs GPU memory when enabled; plan for VRAM usage.
- **Optional validation / exports**
  - Visual diagnostics include UMAP overlays (\`ov.pl.embedding\`), Milo beeswarm plots, and custom color palettes.`
    },
    {
      title: "scDrug response prediction (`t_scdrug.ipynb`)",
      content: `- **Prerequisites**
  - Fetch tumor-focused dataset (e.g., \`infercnvpy.datasets.maynard2020_3k\`).
  - Download reference assets **before** running predictions:
    - Gene annotations via \`ov.utils.get_gene_annotation\` (requires GTF from GENCODE or T2T-CHM13).
    - \`ov.utils.download_GDSC_data()\` and \`ov.utils.download_CaDRReS_model()\` for drug-response models.
    - Clone CaDRReS-Sc repo (\`git clone https://github.com/CSB5/CaDRReS-Sc\`).
- **Core calls**
  - Tumor resolution detection: \`ov.single.autoResolution(adata, cpus=4)\`.
  - Drug response runner: \`ov.single.Drug_Response(adata, scriptpath='CaDRReS-Sc', modelpath='models/', output='result')\`.
- **Result checks**
  - Inspect clustering and IC50 outputs stored under \`output\`; cross-reference with inferred CNV states.
- **Resources**
  - Requires external CaDRReS-Sc environment (Python/R dependencies) and storage for model downloads.
  - Running inferCNV preprocessing may need multiple CPUs and substantial RAM.
- **Optional validation / exports**
  - Persist intermediate \`AnnData\` (\`adata.write('scanpyobj.h5ad')\`) to reuse for downstream analyses or re-runs.`
    },
    {
      title: "SCENIC regulon discovery (`t_scenic.ipynb`)",
      content: `**For comprehensive SCENIC guidance** (database downloads, RegDiffusion tuning, RSS interpretation, GRN visualization), use \`search_skills('SCENIC regulon GRN')\` to load the dedicated SCENIC skill.

- **Prerequisites**
  - Mouse hematopoiesis dataset loaded via \`ov.single.mouse_hsc_nestorowa16()\` (or provide preprocessed data with raw counts).
  - Download cisTarget ranking databases (\`*.feather\`) and motif annotations (\`motifs-*.tbl\`) for the species; allocate
    >3 GB disk space and verify paths (\`db_glob\`, \`motif_path\`).
- **Core calls**
  - Initialize analysis: \`ov.single.SCENIC(adata, db_glob=..., motif_path=..., n_jobs=12)\`.
  - Run RegDiffusion-based GRN inference, regulon pruning, and AUCell scoring via the SCENIC object methods.
- **Result checks**
  - Examine regulon activity matrices (\`scenic_obj.auc_mtx.head()\`), RSS scores, and embeddings colored by regulon activity.
  - Use RSS plots, dendrograms, and AUCell distributions to interpret TF specificity and activity thresholds.
- **Resources**
  - Multi-core CPU recommended (\`n_jobs\` matches available cores); ensure enough RAM for motif enrichment.
  - Large downloads and intermediate objects (pickle/h5ad) require disk space.
- **Optional validation / exports**
  - Save \`scenic_obj\` (\`ov.utils.save\`) and regulon AnnData (\`regulon_ad.write\`).
  - Optional plots: RSS per cell type, regulon embeddings, AUC histograms with threshold lines, GRN network visualizations.`
    },
    {
      title: "cNMF program discovery (`t_cnmf.ipynb`)",
      content: `- **Prerequisites**
  - Preprocess with HVG selection (\`ov.pp.preprocess\`), scaling (\`ov.pp.scale\`), PCA, and have UMAP embeddings for inspection.
  - Select component range (e.g., \`np.arange(5, 11)\`) and iterations; ensure output directory exists.
- **Core calls**
  - Instantiate analysis: \`ov.single.cNMF(..., output_dir='...', name='...')\`.
  - Factorization workflow: \`cnmf_obj.factorize(...)\`, \`cnmf_obj.combine(...)\`, \`cnmf_obj.k_selection_plot()\`,
    \`cnmf_obj.consensus(...)\`.
  - Extract results: \`cnmf_obj.load_results(...)\`, \`cnmf_obj.get_results(...)\`, optional RF classifier via \`get_results_rfc\`.
- **Result checks**
  - Evaluate stability via K-selection plot and local density histogram; confirm chosen K with consensus heatmaps.
  - Inspect topic usage embeddings (\`ov.pl.embedding\`), cluster labels, and dotplots of top genes.
- **Resources**
  - Multiple iterations and components are CPU-heavy; consider distributing workers (\`total_workers\`) and verifying disk
    space for intermediate factorization files.
- **Optional validation / exports**
  - Visualizations include Euclidean distance heatmaps, density histograms, UMAP overlays for topics/clusters, and dotplots.`
    },
    {
      title: "NOCD overlapping communities (`t_nocd.ipynb`)",
      content: `- **Prerequisites**
  - Prepare AnnData via \`ov.single.scanpy_lazy\` (automated preprocessing) before running NOCD.
  - Note: Tutorial warns NOCD implementation is under active development—expect variability.
- **Core calls**
  - Pipeline wrapper: \`scbrca = ov.single.scnocd(adata)\` followed by chained methods (\`matrix_transform\`, \`matrix_normalize\`,
    \`GNN_configure\`, \`GNN_preprocess\`, \`GNN_model\`, \`GNN_result\`, \`GNN_plot\`, \`cal_nocd\`, \`calculate_nocd\`).
- **Result checks**
  - Compare standard Leiden clusters versus NOCD outputs on UMAP embeddings to identify multi-fate cells.
- **Resources**
  - Graph neural network stages can be GPU-accelerated; ensure CUDA availability or be prepared for longer CPU runtimes.
  - Track memory usage when constructing large adjacency matrices.
- **Optional validation / exports**
  - Generate multiple UMAP overlays (\`sc.pl.umap\`) for \`nocd\`, \`nocd_n\`, and Leiden labels using shared color maps.`
    },
    {
      title: "Lazy pipeline & reporting (`t_lazy.ipynb`)",
      content: `- **Prerequisites**
  - Install OmicVerse ≥1.7.0 with lazy utilities; supported species currently human/mouse.
  - Prepare batch metadata (\`sample_key\`) and optionally initialize hybrid compute (\`ov.settings.cpu_gpu_mixed_init()\`).
- **Core calls**
  - Turnkey preprocessing: \`ov.single.lazy(adata, species='mouse', sample_key='batch', ...)\` with optional \`reforce_steps\`
    and module-specific kwargs.
  - Reporting: \`ov.single.generate_scRNA_report(...)\` to build HTML summary; \`ov.generate_reference_table(adata)\` for
    citation tracking.
- **Result checks**
  - Inspect generated embeddings (\`ov.pl.embedding\`) for quality and annotation alignment.
  - Review HTML report for QC metrics, normalization, batch correction, and embeddings.
- **Resources**
  - Steps like Harmony or scVI may invoke GPU; confirm hardware availability or adjust \`reforce_steps\` accordingly.
  - Report generation writes to disk; ensure output path is writable.
- **Optional validation / exports**
  - Customize embeddings by color key; store HTML report and reference table alongside project documentation.`
    },
  ]
};

const _single_multiomics: FullSkillData = {
  key: "single-multiomics",
  name: "single-cell-multi-omics-integration",
  title: "Single-cell multi-omics integration",
  description: "Multi-omics integration: MOFA factor analysis, GLUE unpaired alignment, SIMBA batch correction, TOSICA label transfer, StaVIA trajectory. Covers scRNA+scATAC paired/unpaired workflows.",
  sections: [
    {
      title: "Method Selection Guide",
      content: `Pick the right tool before writing any code:

| Scenario | Method | Key Class |
|----------|--------|-----------|
| Paired RNA + ATAC from same cells | MOFA directly | \`ov.single.pyMOFA\` |
| Unpaired RNA + ATAC (different experiments) | GLUE pairing → MOFA | \`ov.single.GLUE_pair\` → \`pyMOFA\` |
| Multi-batch single-modality integration | SIMBA | \`ov.single.pySIMBA\` |
| Transfer labels from annotated reference | TOSICA | \`ov.single.pyTOSICA\` |
| Trajectory on preprocessed multi-omic data | StaVIA | \`VIA.core.VIA\` |`
    },
    {
      title: "Instructions",
      content: `### 1. MOFA on paired multi-omics

Use MOFA when you have paired measurements (RNA + ATAC from the same cells). MOFA learns shared and modality-specific factors that explain variance across omics layers.

1. Load each modality as a **separate AnnData** object
2. Initialise \`pyMOFA\` with matching \`omics\` and \`omics_name\` lists
3. Run \`mofa_preprocess()\` to select HVGs, then \`mofa_run(outfile=...)\` to train
4. Inspect factors with \`pyMOFAART(model_path=...)\` for correlation, weights, and variance plots
5. Dependencies: \`mofapy2\`; CPU-only

### 2. GLUE pairing then MOFA

Use GLUE when RNA and ATAC come from different experiments (unpaired). GLUE aligns cells across modalities by learning a shared embedding, then MOFA identifies joint factors.

1. Start from GLUE-derived embeddings (\`.h5ad\` files with embeddings in \`.obsm\`)
2. Build \`GLUE_pair\` and call \`correlation()\` to match unpaired cells
3. Subset to HVGs and run MOFA as in the paired workflow
4. Dependencies: \`mofapy2\`, \`scglue\`, \`scvi-tools\`; GPU optional for MDE embedding

### 3. SIMBA batch integration

Use SIMBA for multi-batch single-modality data (e.g., multiple pancreas studies). SIMBA builds a graph from binned features and learns batch-corrected embeddings via PyTorch-BigGraph.

1. Load concatenated AnnData with a \`batch\` column in \`.obs\`
2. Initialise \`pySIMBA(adata, workdir)\` and run the preprocessing pipeline
3. Call \`gen_graph()\` then \`train(num_workers=...)\` to learn embeddings
4. Apply \`batch_correction()\` to get harmonised AnnData with \`X_simba\`
5. Dependencies: \`simba\`, \`simba_pbg\`; GPU optional, needs adequate CPU threads

### 4. TOSICA reference transfer

Use TOSICA to transfer cell-type labels from a well-annotated reference to a query dataset. TOSICA uses a pathway-masked transformer that also provides attention-based interpretability.

1. Download gene-set GMT files with \`ov.utils.download_tosica_gmt()\`
2. Initialise \`pyTOSICA\` with reference AnnData, GMT path, label key, and project path
3. Train with \`train(epochs=...)\`, save, then predict on query data
4. Dependencies: TOSICA (PyTorch transformer); \`depth=1\` recommended (depth=2 doubles memory)

### 5. StaVIA trajectory cartography

Use StaVIA/VIA for trajectory inference on preprocessed data with velocity information. VIA computes pseudotime, cluster graphs, and stream plots.

1. Preprocess with OmicVerse (HVGs, scale, PCA, neighbors, UMAP)
2. Configure VIA with root selection, components, neighbors, and resolution
3. Run \`v0.run_VIA()\` and extract pseudotime from \`single_cell_pt_markov\`
4. Dependencies: \`scvelo\`, \`pyVIA\`; CPU-bound`
    },
    {
      title: "Critical API Reference",
      content: `### MOFA: \`omics\` must be a list of separate AnnData objects

\`\`\`python
# CORRECT — each modality is a separate AnnData
mofa = ov.single.pyMOFA(omics=[rna_adata, atac_adata], omics_name=['RNA', 'ATAC'])

# WRONG — do NOT pass a single concatenated AnnData
# mofa = ov.single.pyMOFA(omics=combined_adata, omics_name=['RNA', 'ATAC'])  # TypeError!
\`\`\`

The \`omics\` list and \`omics_name\` list must have the same length. Each AnnData should contain cells from the same experiment (paired measurements).

### SIMBA: \`preprocess()\` must run before \`gen_graph()\`

\`\`\`python
# CORRECT — preprocess first, then build graph
simba = ov.single.pySIMBA(adata, workdir)
simba.preprocess(batch_key='batch', min_n_cells=3, method='lib_size', n_top_genes=3000, n_bins=5)
simba.gen_graph()
simba.train(num_workers=6)

# WRONG — skipping preprocess causes gen_graph to fail
# simba.gen_graph()  # KeyError: missing binned features
\`\`\`

### TOSICA: \`gmt_path\` must be an actual file path

\`\`\`python
# CORRECT — download GMT files first, then pass the file path
ov.utils.download_tosica_gmt()
tosica = ov.single.pyTOSICA(adata=ref, gmt_path='genesets/GO_bp.gmt', ...)

# WRONG — passing a database name string instead of file path
# tosica = ov.single.pyTOSICA(adata=ref, gmt_path='GO_Biological_Process', ...)  # FileNotFoundError!
\`\`\`

### MOFA HDF5: \`outfile\` directory must exist

\`\`\`python
import os
os.makedirs('models', exist_ok=True)  # Create output directory first
mofa.mofa_run(outfile='models/rna_atac.hdf5')
\`\`\``
    },
    {
      title: "Defensive Validation Patterns",
      content: `Always validate inputs before running integration methods:

\`\`\`python
# Before MOFA: verify inputs are compatible
assert isinstance(omics, list), "omics must be a list of AnnData objects"
assert len(omics) == len(omics_name), f"omics ({len(omics)}) and omics_name ({len(omics_name)}) must match in length"
for i, a in enumerate(omics):
    assert a.n_obs > 0, f"AnnData '{omics_name[i]}' has 0 cells"
    assert a.n_vars > 0, f"AnnData '{omics_name[i]}' has 0 genes/features"

# Before SIMBA: verify batch column exists
assert 'batch' in adata.obs.columns, "adata.obs must contain a 'batch' column for SIMBA"
assert adata.obs['batch'].nunique() > 1, "Need >1 batch for batch integration"

# Before TOSICA: verify GMT file exists and reference has labels
import os
assert os.path.isfile(gmt_path), f"GMT file not found: {gmt_path}. Run ov.utils.download_tosica_gmt() first."
assert label_name in ref_adata.obs.columns, f"Label column '{label_name}' not found in reference AnnData"

# Before StaVIA: verify PCA and neighbors are computed
assert 'X_pca' in adata.obsm, "PCA required. Run ov.pp.pca(adata) first."
assert 'neighbors' in adata.uns, "Neighbor graph required. Run ov.pp.neighbors(adata) first."
\`\`\``
    },
    {
      title: "Troubleshooting",
      content: `- **\`PermissionError\` or \`OSError\` writing MOFA HDF5**: The output directory for \`mofa_run(outfile=...)\` must exist and be writable. Create it with \`os.makedirs()\` before training.
- **GLUE \`correlation()\` returns empty DataFrame**: The RNA and ATAC embeddings have no overlapping features. Verify both AnnData objects have been through GLUE preprocessing and contain embeddings in \`.obsm\`.
- **SIMBA \`gen_graph()\` runs out of memory**: Reduce \`n_top_genes\` (try 2000) or increase \`n_bins\` to compress the feature space. SIMBA graph construction scales with gene count.
- **TOSICA \`FileNotFoundError\` after \`download_tosica_gmt()\`**: The download writes to \`genesets/\` in the current working directory. Verify the file exists at the expected path, or pass an absolute path.
- **StaVIA \`root_user\` mismatch**: The root must be a value that exists in the \`true_label\` array. Check \`adata.obs['clusters'].unique()\` to find valid root names.
- **\`ImportError: No module named 'mofapy2'\`**: Install with \`pip install mofapy2\`. Similarly, SIMBA needs \`pip install simba simba_pbg\`.
- **MOFA factors all zero or NaN**: Input AnnData may have constant or all-zero features. Filter genes with \`sc.pp.filter_genes(adata, min_cells=10)\` before MOFA.`
    },
    {
      title: "Examples",
      content: `- "I have paired scRNA and scATAC h5ad files—run MOFA to find shared factors and plot variance explained per factor."
- "Integrate three pancreas batches using SIMBA and visualise the corrected embedding coloured by batch and cell type."
- "Transfer cell type labels from my annotated reference to a new query dataset using TOSICA with GO biological process pathways."`
    },
    {
      title: "References",
      content: `- MOFA tutorial: \`t_mofa.ipynb\`
- GLUE+MOFA tutorial: \`t_mofa_glue.ipynb\`
- SIMBA tutorial: \`t_simba.ipynb\`
- TOSICA tutorial: \`t_tosica.ipynb\`
- StaVIA tutorial: \`t_stavia.ipynb\`
- Quick copy/paste commands: [\`reference.md\`](reference.md)`
    },
  ]
};

const _single_to_spatial_mapping: FullSkillData = {
  key: "single-to-spatial-mapping",
  name: "single2spatial-spatial-mapping",
  title: "Single2Spatial spatial mapping",
  description: "Map scRNA-seq atlases onto spatial transcriptomics slides using omicverse's Single2Spatial workflow for deep-forest training, spot-level assessment, and marker visualisation.",
  sections: [
    {
      title: "Overview",
      content: `Apply this skill when converting single-cell references into spatially resolved profiles. It follows [\`t_single2spatial.ipynb\`](../../omicverse_guide/docs/Tutorials-bulk2single/t_single2spatial.ipynb), demonstrating how Single2Spatial trains on PDAC scRNA-seq and Visium data, reconstructs spot-level proportions, and visualises marker expression.`
    },
    {
      title: "Instructions",
      content: `1. **Import dependencies and style**
   - Load \`omicverse as ov\`, \`scanpy as sc\`, \`anndata\`, \`pandas as pd\`, \`numpy as np\`, and \`matplotlib.pyplot as plt\`.
   - Call \`ov.utils.ov_plot_set()\` (or \`ov.plot_set()\` in older versions) to align plots with omicverse styling.
2. **Load single-cell and spatial datasets**
   - Read processed matrices with \`pd.read_csv(...)\` then create AnnData objects (\`anndata.AnnData(raw_df.T)\`).
   - Attach metadata: \`single_data.obs = pd.read_csv(...)[['Cell_type']]\` and \`spatial_data.obs = pd.read_csv(... )\` containing coordinates and slide metadata.
3. **Initialise Single2Spatial**
   - Instantiate \`ov.bulk2single.Single2Spatial(single_data=single_data, spatial_data=spatial_data, celltype_key='Cell_type', spot_key=['xcoord','ycoord'], gpu=0)\`.
   - Note that inputs should be normalised/log-scaled scRNA-seq matrices; ensure \`spot_key\` matches spatial coordinate columns.
4. **Train the deep-forest model**
   - Execute \`st_model.train(spot_num=500, cell_num=10, df_save_dir='...', df_save_name='pdac_df', k=10, num_epochs=1000, batch_size=1000, predicted_size=32)\` to fit the mapper and generate reconstructed spatial AnnData (\`sp_adata\`).
   - Explain that \`spot_num\` defines sampled pseudo-spots per iteration and \`cell_num\` controls per-spot cell draws.
5. **Load pretrained weights**
   - Use \`st_model.load(modelsize=14478, df_load_dir='.../pdac_df.pth', k=10, predicted_size=32)\` when checkpoints already exist to skip training.
6. **Assess spot-level outputs**
   - Call \`st_model.spot_assess()\` to compute aggregated spot AnnData (\`sp_adata_spot\`) for QC.
   - Plot marker genes with \`sc.pl.embedding(sp_adata, basis='X_spatial', color=['REG1A', 'CLDN1', ...], frameon=False, ncols=4)\`.
7. **Visualise proportions and cell-type maps**
   - Use \`sc.pl.embedding(sp_adata_spot, basis='X_spatial', color=['Acinar cells', ...], frameon=False)\` to highlight per-spot cell fractions.
   - Plot \`sp_adata\` coloured by \`Cell_type\` with \`palette=ov.utils.ov_palette()[11:]\` to show reconstructed assignments.
8. **Export results**
   - Encourage saving generated AnnData objects (\`sp_adata.write_h5ad(...)\`, \`sp_adata_spot.write_h5ad(...)\`) and derived CSV summaries for downstream reporting.
9. **Defensive validation**
   \`\`\`python
   # Before Single2Spatial: verify spatial coordinates exist
   for col in spot_key:
       assert col in spatial_data.obs.columns, f"Spatial coordinate column '{col}' not found in spatial_data.obs"
   # Verify scRNA-seq is log-normalized (max should be <~15, not hundreds/thousands)
   if single_data.X.max() > 50:
       print("WARNING: scRNA-seq data may not be log-normalized. Raw counts cause scale mismatches.")
   # Verify cell type column exists
   assert celltype_key in single_data.obs.columns, f"Cell type column '{celltype_key}' not found"
   \`\`\`
10. **Troubleshooting tips**
   - If training diverges, reduce \`learning_rate\` via keyword arguments or decrease \`predicted_size\` to stabilise the forest.
   - Ensure scRNA-seq inputs are log-normalised; raw counts can lead to scale mismatches and poor spatial predictions.
   - Verify GPU availability when \`gpu\` is non-zero; fallback to CPU by omitting the argument or setting \`gpu=-1\`.`
    },
    {
      title: "Examples",
      content: `- "Train Single2Spatial on PDAC scRNA-seq and Visium slides, then visualise REG1A and CLDN1 spatial expression."
- "Load a saved Single2Spatial checkpoint to regenerate spot-level cell-type proportions for reporting."
- "Plot reconstructed cell-type maps with omicverse palettes to compare against histology."`
    },
    {
      title: "References",
      content: `- Tutorial notebook: [\`t_single2spatial.ipynb\`](../../omicverse_guide/docs/Tutorials-bulk2single/t_single2spatial.ipynb)
- Example datasets and models: [\`omicverse_guide/docs/Tutorials-bulk2single/data/pdac/\`](../../omicverse_guide/docs/Tutorials-bulk2single/data/pdac/)
- Quick copy/paste commands: [\`reference.md\`](reference.md)`
    },
  ]
};

export const allSkillsData: FullSkillData[] = [
  _single_preprocessing,
  _single_clustering,
  _single_annotation,
  _single_popv_annotation,
  _single_trajectory,
  _single_cellfate_analysis,
  _single_cellphone_db,
  _single_scenic_grn,
  _single_downstream_analysis,
  _single_multiomics,
  _single_to_spatial_mapping,
];

export const skillsMap: Record<string, FullSkillData> = {
  "single-cell-preprocessing-with-omicverse": _single_preprocessing,
  "/single-preprocessing": _single_preprocessing,
  "single-cell-clustering-and-batch-correction-with-omicverse": _single_clustering,
  "/single-clustering": _single_clustering,
  "single-cell-annotation-skills-with-omicverse": _single_annotation,
  "/single-annotation": _single_annotation,
  "single-popv-annotation": _single_popv_annotation,
  "/single-popv-annotation": _single_popv_annotation,
  "single-trajectory-analysis": _single_trajectory,
  "/single-trajectory": _single_trajectory,
  "cellfate-pseudotime-gene-analysis": _single_cellfate_analysis,
  "/single-cellfate-analysis": _single_cellfate_analysis,
  "single-cell-cellphonedb-communication-mapping": _single_cellphone_db,
  "/single-cellphone-db": _single_cellphone_db,
  "scenic-gene-regulatory-network": _single_scenic_grn,
  "/single-scenic-grn": _single_scenic_grn,
  "single-cell-downstream-analysis": _single_downstream_analysis,
  "/single-downstream-analysis": _single_downstream_analysis,
  "single-cell-multi-omics-integration": _single_multiomics,
  "/single-multiomics": _single_multiomics,
  "single2spatial-spatial-mapping": _single_to_spatial_mapping,
  "/single-to-spatial-mapping": _single_to_spatial_mapping,
};