type IOptions = {
    page?: number | string,
    limit?: number | string,
    sortOrder?: 'asc' | 'desc',
    sortBy?: string
}

type IOptionsResult = {
    page: number,
    limit: number,
    skip: number,
    sortBy: string,
    sortOrder: 'asc' | 'desc'
}

const paginationAndSortingHelper = (options: IOptions): IOptionsResult => {

    console.log("Options:", options);

    const page = options.page ? parseInt(options.page as string) : 1;
    const limit = options.limit ? parseInt(options.limit as string) : 10;
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 'asc' : 'desc';


    console.log("Pagination and Sorting Result:", {
        page,
        limit,
        skip,
    });

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder
    }
}


export default paginationAndSortingHelper;